import { type Alert } from '@prisma/client';
import OpenAI from 'openai';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface PriorityAnalysis {
  level: PriorityLevel;
  confidence: number;
  reasoning: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzePriority(
  alert: Pick<Alert, 'title' | 'message' | 'type' | 'metadata'>,
  historicalContext?: {
    recentAlertCount: number;
    similarIncidentsLast24h: number;
    averageResolutionTime?: number;
  }
): Promise<PriorityAnalysis> {
  const prompt = `
    Analyze the following alert and determine its priority level:
    Title: ${alert.title}
    Message: ${alert.message}
    Type: ${alert.type}
    Additional Context:
    - Recent alerts in last hour: ${historicalContext?.recentAlertCount ?? 'N/A'}
    - Similar incidents in last 24h: ${historicalContext?.similarIncidentsLast24h ?? 'N/A'}
    - Average resolution time: ${historicalContext?.averageResolutionTime ?? 'N/A'}

    Determine the priority level (critical, high, medium, or low) based on:
    1. Severity of the issue
    2. Potential business impact
    3. Historical context
    4. Time sensitivity

    Respond in JSON format with:
    {
      "level": "priority_level",
      "confidence": confidence_score_between_0_and_1,
      "reasoning": "brief_explanation"
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI analyzing alert priorities for a SaaS monitoring system."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content) as PriorityAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error analyzing priority:', error);
    // Fallback to medium priority if AI analysis fails
    return {
      level: 'medium',
      confidence: 0.5,
      reasoning: 'Fallback priority due to analysis error'
    };
  }
}

import { Redis } from '@upstash/redis'

// Ensure the URL is properly formatted
const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim()
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

if (!redisUrl) {
  throw new Error('UPSTASH_REDIS_REST_URL is not defined')
}

if (!redisToken) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined')
}

// Ensure URL starts with https://
const formattedUrl = redisUrl.startsWith('https://') ? redisUrl : `https://${redisUrl}`

export const redis = new Redis({
  url: formattedUrl,
  token: redisToken,
})

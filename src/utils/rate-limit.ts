export interface RateLimiterOptions {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum number of requests allowed in the interval
  uniqueTokenPerInterval?: number // Maximum number of unique tokens to track
}

export function rateLimit(options: RateLimiterOptions) {
  const windowMap = new Map<string, number>()
  const tokenMap = new Map<string, number>()

  return {
    check: async (token: string = "default") => {
      const now = Date.now()
      const tokenCount = tokenMap.get(token) || 0

      // Clean up old windows
      for (const [key, timestamp] of windowMap.entries()) {
        if (now - timestamp > options.interval) {
          windowMap.delete(key)
          tokenMap.delete(key)
        }
      }

      // Check token limit
      if (
        options.uniqueTokenPerInterval &&
        tokenMap.size >= options.uniqueTokenPerInterval
      ) {
        throw new Error("Rate limit exceeded: Too many unique tokens")
      }

      // Check request limit
      if (tokenCount >= options.maxRequests) {
        throw new Error("Rate limit exceeded: Too many requests")
      }

      // Update counts
      windowMap.set(token, now)
      tokenMap.set(token, tokenCount + 1)

      return true
    },
  }
}

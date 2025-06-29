/**
 * Rate Limiter Module
 * 
 * Provides basic rate limiting functionality.
 * Focused and minimal - limits request frequency.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  isAllowed: boolean;
  remaining: number;
  resetTime: number;
}

// ============================================================================
// RATE LIMITER CLASS
// ============================================================================

export class RateLimiter {
  private limits: Map<string, { count: number; resetTime: number }> = new Map();
  private defaultConfig: RateLimitConfig;

  constructor(config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }) {
    this.defaultConfig = config;
  }

  /**
   * Check if request is allowed
   */
  checkLimit(identifier: string, config?: Partial<RateLimitConfig>): RateLimitResult {
    const limitConfig = { ...this.defaultConfig, ...config };
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / limitConfig.windowMs)}`;

    const current = this.limits.get(key);
    
    if (!current || now >= current.resetTime) {
      // New window or expired
      this.limits.set(key, {
        count: 1,
        resetTime: now + limitConfig.windowMs,
      });
      
      return {
        isAllowed: true,
        remaining: limitConfig.maxRequests - 1,
        resetTime: now + limitConfig.windowMs,
      };
    }

    if (current.count >= limitConfig.maxRequests) {
      return {
        isAllowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }

    // Increment count
    current.count++;
    this.limits.set(key, current);

    return {
      isAllowed: true,
      remaining: limitConfig.maxRequests - current.count,
      resetTime: current.resetTime,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  resetLimit(identifier: string): void {
    const now = Date.now();
    const key = `${identifier}:${Math.floor(now / this.defaultConfig.windowMs)}`;
    this.limits.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAllLimits(): void {
    this.limits.clear();
  }

  /**
   * Get current limits count
   */
  getLimitsCount(): number {
    return this.limits.size;
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter(); 
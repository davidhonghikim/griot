export class RateLimiter {
    constructor(config = { maxRequests: 100, windowMs: 60000 }) {
        this.limits = new Map();
        this.defaultConfig = config;
    }
    checkLimit(identifier, config) {
        const limitConfig = { ...this.defaultConfig, ...config };
        const now = Date.now();
        const key = `${identifier}:${Math.floor(now / limitConfig.windowMs)}`;
        const current = this.limits.get(key);
        if (!current || now >= current.resetTime) {
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
        current.count++;
        this.limits.set(key, current);
        return {
            isAllowed: true,
            remaining: limitConfig.maxRequests - current.count,
            resetTime: current.resetTime,
        };
    }
    resetLimit(identifier) {
        const now = Date.now();
        const key = `${identifier}:${Math.floor(now / this.defaultConfig.windowMs)}`;
        this.limits.delete(key);
    }
    clearAllLimits() {
        this.limits.clear();
    }
    getLimitsCount() {
        return this.limits.size;
    }
}
export const rateLimiter = new RateLimiter();
//# sourceMappingURL=rate_limiter.js.map
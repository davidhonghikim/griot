export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}
export interface RateLimitResult {
    isAllowed: boolean;
    remaining: number;
    resetTime: number;
}
export declare class RateLimiter {
    private limits;
    private defaultConfig;
    constructor(config?: RateLimitConfig);
    checkLimit(identifier: string, config?: Partial<RateLimitConfig>): RateLimitResult;
    resetLimit(identifier: string): void;
    clearAllLimits(): void;
    getLimitsCount(): number;
}
export declare const rateLimiter: RateLimiter;
//# sourceMappingURL=rate_limiter.d.ts.map
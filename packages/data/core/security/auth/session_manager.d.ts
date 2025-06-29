export interface Session {
    id: string;
    userId: string;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
}
export interface SessionManagerConfig {
    sessionTimeout: number;
    maxSessionsPerUser: number;
}
export declare class SessionManager {
    private sessions;
    private config;
    constructor(config?: Partial<SessionManagerConfig>);
    createSession(userId: string): Session;
    validateSession(token: string): Session | null;
    invalidateSession(token: string): boolean;
    getUserSessions(userId: string): Session[];
    private cleanupExpiredSessions;
    getActiveSessionsCount(): number;
    clearAllSessions(): void;
}
export declare const sessionManager: SessionManager;
//# sourceMappingURL=session_manager.d.ts.map
import * as crypto from 'crypto';
export class SessionManager {
    constructor(config = {}) {
        this.sessions = new Map();
        this.config = {
            sessionTimeout: 30 * 60 * 1000,
            maxSessionsPerUser: 3,
            ...config,
        };
    }
    createSession(userId) {
        this.cleanupExpiredSessions();
        const userSessions = this.getUserSessions(userId);
        if (userSessions.length >= this.config.maxSessionsPerUser) {
            const oldestSession = userSessions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
            this.sessions.delete(oldestSession.id);
        }
        const session = {
            id: crypto.randomUUID(),
            userId,
            token: crypto.randomBytes(32).toString('hex'),
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.config.sessionTimeout),
            isActive: true,
        };
        this.sessions.set(session.id, session);
        return session;
    }
    validateSession(token) {
        for (const session of this.sessions.values()) {
            if (session.token === token && session.isActive && session.expiresAt > new Date()) {
                return session;
            }
        }
        return null;
    }
    invalidateSession(token) {
        for (const session of this.sessions.values()) {
            if (session.token === token) {
                session.isActive = false;
                return true;
            }
        }
        return false;
    }
    getUserSessions(userId) {
        return Array.from(this.sessions.values()).filter(s => s.userId === userId && s.isActive);
    }
    cleanupExpiredSessions() {
        const now = new Date();
        for (const [id, session] of this.sessions.entries()) {
            if (session.expiresAt <= now || !session.isActive) {
                this.sessions.delete(id);
            }
        }
    }
    getActiveSessionsCount() {
        this.cleanupExpiredSessions();
        return this.sessions.size;
    }
    clearAllSessions() {
        this.sessions.clear();
    }
}
export const sessionManager = new SessionManager();
//# sourceMappingURL=session_manager.js.map
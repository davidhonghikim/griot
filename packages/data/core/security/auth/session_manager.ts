/**
 * Session Manager Module
 * 
 * Provides basic session management functionality.
 * Focused and minimal - manages user sessions.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface Session {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

export interface SessionManagerConfig {
  sessionTimeout: number; // milliseconds
  maxSessionsPerUser: number;
}

// ============================================================================
// SESSION MANAGER CLASS
// ============================================================================

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private config: SessionManagerConfig;

  constructor(config: Partial<SessionManagerConfig> = {}) {
    this.config = {
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      maxSessionsPerUser: 3,
      ...config,
    };
  }

  /**
   * Create a new session
   */
  createSession(userId: string): Session {
    // Clean up expired sessions
    this.cleanupExpiredSessions();

    // Check session limit
    const userSessions = this.getUserSessions(userId);
    if (userSessions.length >= this.config.maxSessionsPerUser) {
      // Remove oldest session
      const oldestSession = userSessions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
      this.sessions.delete(oldestSession.id);
    }

    const session: Session = {
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

  /**
   * Validate session token
   */
  validateSession(token: string): Session | null {
    for (const session of this.sessions.values()) {
      if (session.token === token && session.isActive && session.expiresAt > new Date()) {
        return session;
      }
    }
    return null;
  }

  /**
   * Invalidate session
   */
  invalidateSession(token: string): boolean {
    for (const session of this.sessions.values()) {
      if (session.token === token) {
        session.isActive = false;
        return true;
      }
    }
    return false;
  }

  /**
   * Get user sessions
   */
  getUserSessions(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId && s.isActive);
  }

  /**
   * Clean up expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [id, session] of this.sessions.entries()) {
      if (session.expiresAt <= now || !session.isActive) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * Get active sessions count
   */
  getActiveSessionsCount(): number {
    this.cleanupExpiredSessions();
    return this.sessions.size;
  }

  /**
   * Clear all sessions
   */
  clearAllSessions(): void {
    this.sessions.clear();
  }
}

// Export singleton instance
export const sessionManager = new SessionManager(); 
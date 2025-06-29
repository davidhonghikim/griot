/**
 * Security Orchestrator Module
 * 
 * Provides basic security orchestration functionality.
 * Focused and minimal - coordinates security modules.
 */

import { threatAnalyzer, ThreatAnalysisResult } from './utils/threat_analyzer';
import { securityLogger, SecurityEvent } from './utils/security_logger';
import { securityMetrics } from './utils/security_metrics';
import { fileValidator } from './file/file_validator';
import { passwordValidator } from './auth/password_validator';
import { urlValidator } from './network/url_validator';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface SecurityResult {
  isAllowed: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: any;
  threatScore: number;
  recommendations: string[];
}

export interface SecurityContext {
  type: 'input' | 'file' | 'auth' | 'network';
  operation?: string;
  user?: any;
  source?: string;
}

// ============================================================================
// SECURITY ORCHESTRATOR CLASS
// ============================================================================

export class SecurityOrchestrator {
  private autoBlockThreshold: number;

  constructor(config: { autoBlockThreshold?: number } = {}) {
    this.autoBlockThreshold = config.autoBlockThreshold || 15;
  }

  /**
   * Comprehensive security validation
   */
  async validateSecurity(data: any, context: SecurityContext): Promise<SecurityResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let sanitizedData = data;

    try {
      // Type-specific validation
      switch (context.type) {
        case 'input':
          // Basic input validation
          break;
        case 'file':
          if (typeof data === 'string') {
            const fileValidation = fileValidator.validatePath(data);
            if (!fileValidation.isValid) {
              errors.push(...fileValidation.errors);
            } else {
              sanitizedData = fileValidation.sanitizedPath;
            }
          }
          break;
        case 'auth':
          if (data.password) {
            const passwordValidation = passwordValidator.validatePassword(data.password);
            if (!passwordValidation.isValid) {
              errors.push(...passwordValidation.errors);
            }
          }
          break;
        case 'network':
          if (typeof data === 'string') {
            const urlValidation = urlValidator.validateUrl(data);
            if (!urlValidation.isValid) {
              errors.push(...urlValidation.errors);
            } else {
              sanitizedData = urlValidation.sanitizedUrl;
            }
          }
          break;
      }

      // Threat analysis
      const threatAnalysis = threatAnalyzer.analyzeThreats(data, context);
      if (threatAnalysis.threats.length > 0) {
        warnings.push(...threatAnalysis.threats);
        recommendations.push(...threatAnalysis.recommendations);
      }

      // Auto-block based on threat score
      if (threatAnalysis.score >= this.autoBlockThreshold) {
        errors.push('Request blocked due to high threat score');
      }

      // Log security event
      const action = errors.length > 0 ? 'blocked' : (warnings.length > 0 ? 'sanitized' : 'allowed');
      securityLogger.logEvent({
        type: context.type as any,
        severity: this.mapErrorsToSeverity(errors, warnings),
        source: context.source || 'unknown',
        details: { data, context },
        action,
      });

      // Record metrics
      const responseTime = Date.now() - startTime;
      securityMetrics.recordEvent({
        action,
        threats: threatAnalysis.threats,
        source: context.source,
        responseTime,
      });

      return {
        isAllowed: errors.length === 0,
        errors,
        warnings,
        sanitizedData,
        threatScore: threatAnalysis.score,
        recommendations,
      };

    } catch (error) {
      const errorResult: SecurityResult = {
        isAllowed: false,
        errors: [`Security validation failed: ${error}`],
        warnings: [],
        threatScore: 0,
        recommendations: ['Review security configuration'],
      };

      securityLogger.logEvent({
        type: 'validation',
        severity: 'critical',
        source: context.source || 'unknown',
        details: { error, context },
        action: 'blocked',
      });

      return errorResult;
    }
  }

  /**
   * Map errors to severity
   */
  private mapErrorsToSeverity(errors: string[], warnings: string[]): 'low' | 'medium' | 'high' | 'critical' {
    if (errors.length > 0) {
      return errors.some(e => e.includes('blocked')) ? 'critical' : 'high';
    }
    if (warnings.length > 0) {
      return warnings.some(w => w.includes('attack')) ? 'high' : 'medium';
    }
    return 'low';
  }
}

// Export singleton instance
export const securityOrchestrator = new SecurityOrchestrator(); 
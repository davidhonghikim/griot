import { threatAnalyzer } from './utils/threat_analyzer';
import { securityLogger } from './utils/security_logger';
import { securityMetrics } from './utils/security_metrics';
import { fileValidator } from './file/file_validator';
import { passwordValidator } from './auth/password_validator';
import { urlValidator } from './network/url_validator';
export class SecurityOrchestrator {
    constructor(config = {}) {
        this.autoBlockThreshold = config.autoBlockThreshold || 15;
    }
    async validateSecurity(data, context) {
        const startTime = Date.now();
        const errors = [];
        const warnings = [];
        const recommendations = [];
        let sanitizedData = data;
        try {
            switch (context.type) {
                case 'input':
                    break;
                case 'file':
                    if (typeof data === 'string') {
                        const fileValidation = fileValidator.validatePath(data);
                        if (!fileValidation.isValid) {
                            errors.push(...fileValidation.errors);
                        }
                        else {
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
                        }
                        else {
                            sanitizedData = urlValidation.sanitizedUrl;
                        }
                    }
                    break;
            }
            const threatAnalysis = threatAnalyzer.analyzeThreats(data, context);
            if (threatAnalysis.threats.length > 0) {
                warnings.push(...threatAnalysis.threats);
                recommendations.push(...threatAnalysis.recommendations);
            }
            if (threatAnalysis.score >= this.autoBlockThreshold) {
                errors.push('Request blocked due to high threat score');
            }
            const action = errors.length > 0 ? 'blocked' : (warnings.length > 0 ? 'sanitized' : 'allowed');
            securityLogger.logEvent({
                type: context.type,
                severity: this.mapErrorsToSeverity(errors, warnings),
                source: context.source || 'unknown',
                details: { data, context },
                action,
            });
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
        }
        catch (error) {
            const errorResult = {
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
    mapErrorsToSeverity(errors, warnings) {
        if (errors.length > 0) {
            return errors.some(e => e.includes('blocked')) ? 'critical' : 'high';
        }
        if (warnings.length > 0) {
            return warnings.some(w => w.includes('attack')) ? 'high' : 'medium';
        }
        return 'low';
    }
}
export const securityOrchestrator = new SecurityOrchestrator();
//# sourceMappingURL=security_orchestrator.js.map
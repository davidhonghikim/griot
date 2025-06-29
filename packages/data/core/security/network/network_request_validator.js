import { ValidationRules } from '../core/validation_rules';
import { SecurityPatterns } from '../core/security_patterns';
export class NetworkRequestValidator {
    constructor(config = {}) {
        this.config = {
            allowedProtocols: ['http', 'https'],
            allowedDomains: [],
            blockedDomains: ['malware.com', 'phishing.com', 'spam.com'],
            maxUrlLength: 2048,
            maxRequestSize: 10 * 1024 * 1024,
            ...config,
        };
    }
    validateRequest(request) {
        const errors = [];
        const warnings = [];
        let sanitizedUrl = request.url;
        let sanitizedHeaders = { ...request.headers };
        let sanitizedBody = request.body;
        const urlValidation = this.validateUrl(request.url);
        if (!urlValidation.isValid) {
            errors.push(...urlValidation.errors);
        }
        else {
            sanitizedUrl = urlValidation.sanitizedValue || request.url;
        }
        const methodValidation = this.validateMethod(request.method);
        if (!methodValidation.isValid) {
            errors.push(...methodValidation.errors);
        }
        const headersValidation = this.validateHeaders(request.headers);
        if (!headersValidation.isValid) {
            errors.push(...headersValidation.errors);
        }
        else {
            sanitizedHeaders = headersValidation.sanitizedValue || request.headers;
        }
        if (request.body) {
            const bodyValidation = this.validateBody(request.body);
            if (!bodyValidation.isValid) {
                errors.push(...bodyValidation.errors);
            }
            else {
                sanitizedBody = bodyValidation.sanitizedValue || request.body;
            }
        }
        return {
            isAllowed: errors.length === 0,
            errors,
            warnings,
            sanitizedUrl,
            sanitizedHeaders,
            sanitizedBody,
        };
    }
    validateUrl(url) {
        const errors = [];
        let sanitizedUrl = url;
        const urlValidation = ValidationRules.patternValidation(/^https?:\/\/[^\s]+$/, 'Invalid URL format');
        const result = urlValidation.validate(url);
        if (!result.isValid) {
            errors.push(...result.errors);
        }
        if (url.length > this.config.maxUrlLength) {
            errors.push(`URL too long: ${url.length} characters (max: ${this.config.maxUrlLength})`);
        }
        const protocol = url.split('://')[0];
        if (!this.config.allowedProtocols.includes(protocol)) {
            errors.push(`Protocol not allowed: ${protocol}`);
        }
        const domain = this.extractDomain(url);
        if (domain && this.config.blockedDomains.includes(domain)) {
            errors.push(`Domain blocked: ${domain}`);
        }
        if (SecurityPatterns.hasSecurityThreat(url)) {
            warnings.push('Security patterns detected in URL');
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedValue: sanitizedUrl,
        };
    }
    validateMethod(method) {
        const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
        return ValidationRules.enumValidation(allowedMethods).validate(method);
    }
    validateHeaders(headers) {
        const errors = [];
        const sanitizedHeaders = {};
        for (const [name, value] of Object.entries(headers)) {
            const nameValidation = this.validateHeaderName(name);
            if (!nameValidation.isValid) {
                errors.push(...nameValidation.errors);
                continue;
            }
            const valueValidation = this.validateHeaderValue(value);
            if (!valueValidation.isValid) {
                errors.push(...valueValidation.errors);
                continue;
            }
            sanitizedHeaders[name] = value;
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedValue: sanitizedHeaders,
        };
    }
    validateHeaderName(name) {
        const errors = [];
        if (!/^[a-zA-Z0-9\-_]+$/.test(name)) {
            errors.push(`Invalid header name: ${name}`);
        }
        if (name.length > 100) {
            errors.push(`Header name too long: ${name.length} characters`);
        }
        return { isValid: errors.length === 0, errors };
    }
    validateHeaderValue(value) {
        const errors = [];
        if (value.length > 1000) {
            errors.push(`Header value too long: ${value.length} characters`);
        }
        if (SecurityPatterns.hasSecurityThreat(value)) {
            errors.push('Security patterns detected in header value');
        }
        return { isValid: errors.length === 0, errors };
    }
    validateBody(body) {
        const errors = [];
        let sanitizedBody = body;
        const bodySize = JSON.stringify(body).length;
        if (bodySize > this.config.maxRequestSize) {
            errors.push(`Request body too large: ${bodySize} bytes (max: ${this.config.maxRequestSize})`);
        }
        if (typeof body === 'string') {
            if (SecurityPatterns.hasSecurityThreat(body)) {
                errors.push('Security patterns detected in request body');
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedValue: sanitizedBody,
        };
    }
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        }
        catch {
            return null;
        }
    }
}
export const networkRequestValidator = new NetworkRequestValidator();
//# sourceMappingURL=network_request_validator.js.map
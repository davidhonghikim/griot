export class CORSValidator {
    constructor(config = {}) {
        this.config = {
            allowedOrigins: ['*'],
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            allowCredentials: false,
            maxAge: 86400,
            ...config,
        };
    }
    validateCORS(request) {
        const errors = [];
        const warnings = [];
        if (request.origin) {
            const originValidation = this.validateOrigin(request.origin);
            if (!originValidation.isAllowed) {
                errors.push(...originValidation.errors);
            }
        }
        const methodValidation = this.validateMethod(request.method);
        if (!methodValidation.isAllowed) {
            errors.push(...methodValidation.errors);
        }
        const headersValidation = this.validateHeaders(request.headers);
        if (!headersValidation.isAllowed) {
            errors.push(...headersValidation.errors);
        }
        return {
            isAllowed: errors.length === 0,
            errors,
            warnings,
            allowedOrigin: this.getAllowedOrigin(request.origin),
            allowedMethods: this.config.allowedMethods,
            allowedHeaders: this.config.allowedHeaders,
        };
    }
    validateOrigin(origin) {
        const errors = [];
        if (this.config.allowedOrigins.includes('*')) {
            return { isAllowed: true, errors: [] };
        }
        if (!this.config.allowedOrigins.includes(origin)) {
            errors.push(`Origin not allowed: ${origin}`);
        }
        return {
            isAllowed: errors.length === 0,
            errors,
        };
    }
    validateMethod(method) {
        const errors = [];
        if (!this.config.allowedMethods.includes(method.toUpperCase())) {
            errors.push(`Method not allowed: ${method}`);
        }
        return {
            isAllowed: errors.length === 0,
            errors,
        };
    }
    validateHeaders(headers) {
        const errors = [];
        for (const headerName of Object.keys(headers)) {
            if (!this.config.allowedHeaders.includes(headerName)) {
                errors.push(`Header not allowed: ${headerName}`);
            }
        }
        return {
            isAllowed: errors.length === 0,
            errors,
        };
    }
    getAllowedOrigin(origin) {
        if (this.config.allowedOrigins.includes('*')) {
            return '*';
        }
        if (origin && this.config.allowedOrigins.includes(origin)) {
            return origin;
        }
        return '';
    }
    getCORSHeaders(origin) {
        const headers = {};
        const allowedOrigin = this.getAllowedOrigin(origin);
        if (allowedOrigin) {
            headers['Access-Control-Allow-Origin'] = allowedOrigin;
        }
        headers['Access-Control-Allow-Methods'] = this.config.allowedMethods.join(', ');
        headers['Access-Control-Allow-Headers'] = this.config.allowedHeaders.join(', ');
        headers['Access-Control-Max-Age'] = this.config.maxAge.toString();
        if (this.config.allowCredentials) {
            headers['Access-Control-Allow-Credentials'] = 'true';
        }
        return headers;
    }
}
export const corsValidator = new CORSValidator();
//# sourceMappingURL=cors_validator.js.map
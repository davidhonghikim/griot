export class SecurityPatterns {
    static getAllPatterns() {
        return [
            this.SQL_INJECTION,
            this.XSS_SCRIPT,
            this.XSS_JAVASCRIPT,
            this.XSS_EVENTS,
            this.COMMAND_INJECTION,
            this.PATH_TRAVERSAL,
            this.HTML_ENTITIES,
            this.SUSPICIOUS_URLS,
            this.NULL_BYTES,
            this.SUSPICIOUS_CHARS,
        ];
    }
    static getPatternsByCategory(category) {
        switch (category) {
            case 'sql':
                return [this.SQL_INJECTION];
            case 'xss':
                return [this.XSS_SCRIPT, this.XSS_JAVASCRIPT, this.XSS_EVENTS];
            case 'injection':
                return [this.COMMAND_INJECTION];
            case 'traversal':
                return [this.PATH_TRAVERSAL];
            case 'all':
            default:
                return this.getAllPatterns();
        }
    }
    static hasSecurityThreat(input) {
        return this.getAllPatterns().some(pattern => pattern.test(input));
    }
    static getMatchingPatterns(input) {
        return this.getAllPatterns().filter(pattern => pattern.test(input));
    }
}
SecurityPatterns.SQL_INJECTION = /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i;
SecurityPatterns.XSS_SCRIPT = /<script[^>]*>.*?<\/script>/gi;
SecurityPatterns.XSS_JAVASCRIPT = /javascript:/gi;
SecurityPatterns.XSS_EVENTS = /on\w+\s*=/gi;
SecurityPatterns.COMMAND_INJECTION = /[;&|`$(){}[\]]/g;
SecurityPatterns.PATH_TRAVERSAL = /\.\.\//g;
SecurityPatterns.HTML_ENTITIES = /&[a-z0-9]+;/gi;
SecurityPatterns.SUSPICIOUS_URLS = /https?:\/\/(?!localhost|127\.0\.0\.1)[^\s]+/gi;
SecurityPatterns.NULL_BYTES = /\0/g;
SecurityPatterns.SUSPICIOUS_CHARS = /[<>\"'&]/g;
//# sourceMappingURL=security_patterns.js.map
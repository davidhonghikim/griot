export declare class SecurityPatterns {
    static readonly SQL_INJECTION: RegExp;
    static readonly XSS_SCRIPT: RegExp;
    static readonly XSS_JAVASCRIPT: RegExp;
    static readonly XSS_EVENTS: RegExp;
    static readonly COMMAND_INJECTION: RegExp;
    static readonly PATH_TRAVERSAL: RegExp;
    static readonly HTML_ENTITIES: RegExp;
    static readonly SUSPICIOUS_URLS: RegExp;
    static readonly NULL_BYTES: RegExp;
    static readonly SUSPICIOUS_CHARS: RegExp;
    static getAllPatterns(): RegExp[];
    static getPatternsByCategory(category: 'sql' | 'xss' | 'injection' | 'traversal' | 'all'): RegExp[];
    static hasSecurityThreat(input: string): boolean;
    static getMatchingPatterns(input: string): RegExp[];
}
//# sourceMappingURL=security_patterns.d.ts.map
export class ThreatAnalyzer {
    constructor() {
        this.threatPatterns = [
            { pattern: 'script', weight: 10, description: 'Potential XSS attack' },
            { pattern: 'union.*select', weight: 15, description: 'Potential SQL injection' },
            { pattern: 'eval\\(', weight: 20, description: 'Code execution attempt' },
            { pattern: 'exec\\(', weight: 20, description: 'Code execution attempt' },
            { pattern: 'system\\(', weight: 20, description: 'System command attempt' },
            { pattern: 'passwd', weight: 5, description: 'Password file access attempt' },
            { pattern: '/etc/', weight: 8, description: 'System directory access' },
            { pattern: 'admin', weight: 3, description: 'Admin access attempt' },
            { pattern: 'root', weight: 5, description: 'Root access attempt' },
        ];
    }
    analyzeThreats(data, context) {
        const threats = [];
        const recommendations = [];
        let score = 0;
        const dataString = JSON.stringify(data).toLowerCase();
        for (const pattern of this.threatPatterns) {
            if (new RegExp(pattern.pattern, 'i').test(dataString)) {
                threats.push(pattern.description);
                score += pattern.weight;
            }
        }
        if (score > 0) {
            recommendations.push('Review input data for suspicious patterns');
        }
        if (score > 10) {
            recommendations.push('Consider blocking this request');
        }
        if (score > 20) {
            recommendations.push('Immediate security review required');
        }
        return {
            score,
            threats,
            recommendations,
        };
    }
    addThreatPattern(pattern) {
        this.threatPatterns.push(pattern);
    }
    getThreatPatterns() {
        return [...this.threatPatterns];
    }
}
export const threatAnalyzer = new ThreatAnalyzer();
//# sourceMappingURL=threat_analyzer.js.map
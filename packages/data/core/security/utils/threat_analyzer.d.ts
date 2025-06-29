export interface ThreatAnalysisResult {
    score: number;
    threats: string[];
    recommendations: string[];
}
export interface ThreatPattern {
    pattern: string;
    weight: number;
    description: string;
}
export declare class ThreatAnalyzer {
    private threatPatterns;
    constructor();
    analyzeThreats(data: any, context?: any): ThreatAnalysisResult;
    addThreatPattern(pattern: ThreatPattern): void;
    getThreatPatterns(): ThreatPattern[];
}
export declare const threatAnalyzer: ThreatAnalyzer;
//# sourceMappingURL=threat_analyzer.d.ts.map
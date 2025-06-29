/**
 * Threat Analyzer Module
 * 
 * Provides basic threat analysis functionality.
 * Focused and minimal - analyzes data for security threats.
 */

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

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

// ============================================================================
// THREAT ANALYZER CLASS
// ============================================================================

export class ThreatAnalyzer {
  private threatPatterns: ThreatPattern[];

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

  /**
   * Analyze data for threats
   */
  analyzeThreats(data: any, context?: any): ThreatAnalysisResult {
    const threats: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Convert data to string for analysis
    const dataString = JSON.stringify(data).toLowerCase();

    // Check against threat patterns
    for (const pattern of this.threatPatterns) {
      if (new RegExp(pattern.pattern, 'i').test(dataString)) {
        threats.push(pattern.description);
        score += pattern.weight;
      }
    }

    // Generate recommendations based on score
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

  /**
   * Add custom threat pattern
   */
  addThreatPattern(pattern: ThreatPattern): void {
    this.threatPatterns.push(pattern);
  }

  /**
   * Get all threat patterns
   */
  getThreatPatterns(): ThreatPattern[] {
    return [...this.threatPatterns];
  }
}

// Export singleton instance
export const threatAnalyzer = new ThreatAnalyzer(); 
#!/usr/bin/env python3
"""
kOS YAML Quality Analyzer
Analyzes the quality and structure of converted YAML files in the kOS node specifications.
Provides insights into conversion quality, metadata completeness, and kOS compliance.
"""

import os
import sys
import yaml
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass, asdict
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/Users/danger/CascadeProjects/griot-node/agents/performance/kos_yaml_analysis.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class YAMLQualityResult:
    """Data class for storing YAML quality analysis results"""
    file_path: str
    node_type: str
    specification_type: str
    yaml_validity: bool
    frontmatter_completeness: float
    metadata_quality: float
    content_structure_quality: float
    kos_compliance_score: float
    overall_quality_score: float
    file_size: int
    word_count: int
    section_count: int
    code_block_count: int
    link_count: int
    issues_found: List[str]
    recommendations: List[str]
    analysis_duration: float
    timestamp: datetime

class KOSYAMLQualityAnalyzer:
    """kOS YAML quality analysis module"""
    
    def __init__(self):
        self.logger = logging.getLogger(f"{__name__}.KOSYAMLQualityAnalyzer")
        
        # kOS-specific patterns and requirements
        self.kos_patterns = {
            'required_frontmatter_fields': [
                'title', 'description', 'type', 'status', 'version', 'last_updated'
            ],
            'kos_node_types': [
                'griot', 'tohunga', 'ronin', 'musa', 'hakim', 'skald', 'oracle', 
                'junzi', 'yachay', 'sachem', 'archon', 'amauta', 'mzee'
            ],
            'kos_specification_types': [
                'overview', 'architecture', 'data_models', 'klf_api', 
                'database_schema', 'cultural_and_ethical_considerations', 'code_examples'
            ],
            'kos_keywords': [
                'kOS', 'HIEROS', 'Kind Link Framework', 'KLF', 'agent specification',
                'node', 'architecture', 'cultural', 'ethical', 'governance'
            ]
        }
    
    def analyze_yaml_file(self, file_path: str) -> YAMLQualityResult:
        """Analyze a single YAML file for quality and kOS compliance"""
        start_time = time.time()
        
        try:
            # Load file content
            content = self._load_file_content(file_path)
            
            # Extract basic information
            node_type = self._extract_node_type(file_path)
            specification_type = self._extract_specification_type(file_path)
            
            # Calculate basic metrics
            file_size = len(content)
            word_count = len(content.split())
            section_count = self._count_sections(content)
            code_block_count = self._count_code_blocks(content)
            link_count = self._count_links(content)
            
            # Analyze YAML validity
            yaml_validity = self._check_yaml_validity(content)
            
            # Analyze frontmatter completeness
            frontmatter_completeness = self._analyze_frontmatter_completeness(content)
            
            # Analyze metadata quality
            metadata_quality = self._analyze_metadata_quality(content)
            
            # Analyze content structure quality
            content_structure_quality = self._analyze_content_structure_quality(content)
            
            # Calculate kOS compliance score
            kos_compliance_score = self._calculate_kos_compliance_score(content, node_type, specification_type)
            
            # Calculate overall quality score
            overall_quality_score = self._calculate_overall_quality_score(
                yaml_validity, frontmatter_completeness, metadata_quality, 
                content_structure_quality, kos_compliance_score
            )
            
            # Identify issues
            issues_found = self._identify_issues(content, node_type, specification_type)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(content, issues_found, node_type, specification_type)
            
            analysis_duration = time.time() - start_time
            
            return YAMLQualityResult(
                file_path=file_path,
                node_type=node_type,
                specification_type=specification_type,
                yaml_validity=yaml_validity,
                frontmatter_completeness=frontmatter_completeness,
                metadata_quality=metadata_quality,
                content_structure_quality=content_structure_quality,
                kos_compliance_score=kos_compliance_score,
                overall_quality_score=overall_quality_score,
                file_size=file_size,
                word_count=word_count,
                section_count=section_count,
                code_block_count=code_block_count,
                link_count=link_count,
                issues_found=issues_found,
                recommendations=recommendations,
                analysis_duration=analysis_duration,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            self.logger.error(f"Error analyzing YAML file {file_path}: {e}")
            raise
    
    def _load_file_content(self, file_path: str) -> str:
        """Load file content with error handling"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
    
    def _extract_node_type(self, file_path: str) -> str:
        """Extract kOS node type from file path"""
        path = Path(file_path)
        
        # Look for node type in directory structure
        for part in path.parts:
            if part.lower() in self.kos_patterns['kos_node_types']:
                return part.lower()
        
        # Try to extract from filename
        filename = path.stem.lower()
        for node_type in self.kos_patterns['kos_node_types']:
            if node_type in filename:
                return node_type
        
        return "unknown"
    
    def _extract_specification_type(self, file_path: str) -> str:
        """Extract kOS specification type from file path"""
        path = Path(file_path)
        filename = path.stem.lower()
        
        # Extract specification type from filename
        for spec_type in self.kos_patterns['kos_specification_types']:
            if spec_type.replace('_', '') in filename.replace('_', ''):
                return spec_type
        
        # Check for numbered specifications
        if re.match(r'\d+_', filename):
            return "numbered_specification"
        
        return "unknown"
    
    def _check_yaml_validity(self, content: str) -> bool:
        """Check if the YAML content is valid"""
        try:
            # Try to parse the entire content as YAML
            yaml.safe_load(content)
            return True
        except yaml.YAMLError:
            return False
    
    def _analyze_frontmatter_completeness(self, content: str) -> float:
        """Analyze the completeness of YAML frontmatter"""
        if not content.startswith('---'):
            return 0.0
        
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1]) or {}
                required_fields = self.kos_patterns['required_frontmatter_fields']
                present_fields = sum(1 for field in required_fields if field in frontmatter)
                return present_fields / len(required_fields)
        except:
            pass
        
        return 0.0
    
    def _analyze_metadata_quality(self, content: str) -> float:
        """Analyze the quality of metadata"""
        if not content.startswith('---'):
            return 0.0
        
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1]) or {}
                
                # Check for metadata structure
                has_metadata = 'metadata:' in parts[1]
                has_frontmatter = 'frontmatter:' in parts[1]
                
                # Check for content quality in key fields
                title_quality = 1.0 if 'title' in frontmatter and len(str(frontmatter['title'])) > 0 else 0.0
                description_quality = 1.0 if 'description' in frontmatter and len(str(frontmatter['description'])) > 10 else 0.0
                
                # Calculate weighted score
                structure_score = 1.0 if has_metadata or has_frontmatter else 0.5
                content_score = (title_quality + description_quality) / 2
                
                return (structure_score + content_score) / 2
        except:
            pass
        
        return 0.0
    
    def _analyze_content_structure_quality(self, content: str) -> float:
        """Analyze the quality of content structure"""
        score = 0.0
        total_checks = 0
        
        # Check for proper YAML structure
        if content.startswith('---') and '---' in content[3:]:
            score += 1.0
        total_checks += 1
        
        # Check for sections
        sections = self._count_sections(content)
        if sections > 0:
            score += 1.0
        total_checks += 1
        
        # Check for code blocks
        code_blocks = self._count_code_blocks(content)
        if code_blocks > 0:
            score += 1.0
        total_checks += 1
        
        # Check for links
        links = self._count_links(content)
        if links > 0:
            score += 1.0
        total_checks += 1
        
        # Check for proper content length
        if len(content) > 1000:
            score += 1.0
        total_checks += 1
        
        return score / total_checks if total_checks > 0 else 0.0
    
    def _count_sections(self, content: str) -> int:
        """Count the number of sections in the content"""
        section_pattern = r'^#{1,6}\s+(.+)$'
        return len(re.findall(section_pattern, content, re.MULTILINE))
    
    def _count_code_blocks(self, content: str) -> int:
        """Count the number of code blocks in the content"""
        lines = content.split('\n')
        in_block = False
        block_count = 0
        
        for line in lines:
            if line.strip().startswith('```'):
                if not in_block:
                    block_count += 1
                in_block = not in_block
        
        return block_count // 2  # Each block has opening and closing ```
    
    def _count_links(self, content: str) -> int:
        """Count the number of links in the content"""
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        return len(re.findall(link_pattern, content))
    
    def _calculate_kos_compliance_score(self, content: str, node_type: str, specification_type: str) -> float:
        """Calculate kOS compliance score"""
        score = 0.0
        total_checks = 0
        
        # Check for kOS branding
        if 'kOS' in content or 'kos' in content.lower():
            score += 1.0
        total_checks += 1
        
        # Check for HIEROS covenant
        if 'HIEROS' in content:
            score += 1.0
        total_checks += 1
        
        # Check for proper node type references
        if node_type != "unknown" and node_type in content.lower():
            score += 1.0
        total_checks += 1
        
        # Check for specification type references
        if specification_type != "unknown" and specification_type.replace('_', ' ') in content.lower():
            score += 1.0
        total_checks += 1
        
        # Check for YAML structure
        if content.startswith('---') and '---' in content[3:]:
            score += 1.0
        total_checks += 1
        
        # Check for kOS-specific keywords
        kos_keywords_found = sum(1 for keyword in self.kos_patterns['kos_keywords'] 
                               if keyword.lower() in content.lower())
        if kos_keywords_found > 0:
            score += min(kos_keywords_found / len(self.kos_patterns['kos_keywords']), 1.0)
        total_checks += 1
        
        return score / total_checks if total_checks > 0 else 0.0
    
    def _calculate_overall_quality_score(self, yaml_validity: bool, frontmatter_completeness: float, 
                                       metadata_quality: float, content_structure_quality: float, 
                                       kos_compliance_score: float) -> float:
        """Calculate overall quality score"""
        weights = {
            'yaml_validity': 0.25,
            'frontmatter_completeness': 0.20,
            'metadata_quality': 0.20,
            'content_structure_quality': 0.15,
            'kos_compliance_score': 0.20
        }
        
        yaml_validity_score = 1.0 if yaml_validity else 0.0
        
        overall_score = (
            yaml_validity_score * weights['yaml_validity'] +
            frontmatter_completeness * weights['frontmatter_completeness'] +
            metadata_quality * weights['metadata_quality'] +
            content_structure_quality * weights['content_structure_quality'] +
            kos_compliance_score * weights['kos_compliance_score']
        )
        
        return min(overall_score, 1.0)  # Cap at 1.0
    
    def _identify_issues(self, content: str, node_type: str, specification_type: str) -> List[str]:
        """Identify issues in the YAML file"""
        issues = []
        
        # Check for YAML validity
        if not self._check_yaml_validity(content):
            issues.append("Invalid YAML syntax")
        
        # Check for missing frontmatter
        if not content.startswith('---'):
            issues.append("Missing YAML frontmatter")
        
        # Check for missing required fields
        if content.startswith('---'):
            try:
                parts = content.split('---', 2)
                frontmatter = yaml.safe_load(parts[1]) or {}
                missing_fields = []
                for field in self.kos_patterns['required_frontmatter_fields']:
                    if field not in frontmatter:
                        missing_fields.append(field)
                if missing_fields:
                    issues.append(f"Missing required fields: {', '.join(missing_fields)}")
            except:
                issues.append("Invalid frontmatter structure")
        
        # Check for missing kOS branding
        if 'kOS' not in content and 'kos' not in content.lower():
            issues.append("Missing kOS branding")
        
        # Check for missing HIEROS covenant
        if 'HIEROS' not in content:
            issues.append("Missing HIEROS covenant reference")
        
        # Check for missing node type references
        if node_type != "unknown" and node_type not in content.lower():
            issues.append(f"Missing {node_type} node type references")
        
        # Check for content length
        if len(content) < 500:
            issues.append("Content too short (less than 500 characters)")
        
        # Check for missing sections
        if self._count_sections(content) < 2:
            issues.append("Insufficient section structure")
        
        return issues
    
    def _generate_recommendations(self, content: str, issues: List[str], node_type: str, specification_type: str) -> List[str]:
        """Generate recommendations for improvement"""
        recommendations = []
        
        # Recommendations based on issues
        if "Invalid YAML syntax" in issues:
            recommendations.append("Fix YAML syntax errors")
        
        if "Missing YAML frontmatter" in issues:
            recommendations.append("Add proper YAML frontmatter with required fields")
        
        if "Missing required fields" in issues:
            recommendations.append("Add missing required frontmatter fields")
        
        if "Missing kOS branding" in issues:
            recommendations.append("Add kOS branding and references")
        
        if "Missing HIEROS covenant" in issues:
            recommendations.append("Include HIEROS covenant references")
        
        if "Content too short" in issues:
            recommendations.append("Expand content with more detailed specifications")
        
        if "Insufficient section structure" in issues:
            recommendations.append("Add more sections for better organization")
        
        # General recommendations
        if node_type != "unknown" and specification_type != "unknown":
            recommendations.append(f"Ensure {node_type} node and {specification_type} specification are properly referenced")
        
        if self._count_code_blocks(content) == 0:
            recommendations.append("Add code examples or implementation details")
        
        if self._count_links(content) == 0:
            recommendations.append("Add relevant links to related specifications")
        
        return recommendations

class KOSYAMLAnalysisPipeline:
    """Main kOS YAML analysis pipeline orchestrator"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.analyzer = KOSYAMLQualityAnalyzer()
        self.logger = logging.getLogger(f"{__name__}.KOSYAMLAnalysisPipeline")
        
        # Create output directory
        self.output_dir = Path(config.get('output_dir', '/Users/danger/CascadeProjects/griot-node/agents/performance'))
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def run_yaml_analysis(self, target_dir: str) -> Dict[str, Any]:
        """Run complete YAML analysis pipeline"""
        start_time = time.time()
        
        self.logger.info(f"Starting kOS YAML analysis: {target_dir}")
        
        # Find YAML files
        yaml_files = self._find_yaml_files(target_dir)
        self.logger.info(f"Found {len(yaml_files)} YAML files to analyze")
        
        # Run analysis
        analysis_results = []
        if self.config.get('parallel_processing', False):
            analysis_results = self._run_parallel_analysis(yaml_files)
        else:
            analysis_results = self._run_sequential_analysis(yaml_files)
        
        # Generate report
        report = self.generate_yaml_analysis_report(analysis_results)
        
        total_duration = time.time() - start_time
        self.logger.info(f"kOS YAML Analysis completed in {total_duration:.2f} seconds")
        
        return {
            'analysis_results': analysis_results,
            'report': report,
            'total_duration': total_duration,
            'file_count': len(yaml_files)
        }
    
    def _find_yaml_files(self, target_dir: str) -> List[str]:
        """Find all YAML files in the target directory"""
        target_path = Path(target_dir)
        yaml_files = list(target_path.rglob("*.yml"))
        return [str(f) for f in yaml_files]
    
    def _run_sequential_analysis(self, yaml_files: List[str]) -> List[YAMLQualityResult]:
        """Run YAML analysis sequentially"""
        results = []
        
        for file_path in yaml_files:
            try:
                result = self.analyzer.analyze_yaml_file(file_path)
                results.append(result)
                self.logger.info(f"Analyzed YAML: {Path(file_path).name}")
            except Exception as e:
                self.logger.error(f"Error analyzing YAML {file_path}: {e}")
        
        return results
    
    def _run_parallel_analysis(self, yaml_files: List[str]) -> List[YAMLQualityResult]:
        """Run YAML analysis in parallel"""
        results = []
        max_workers = self.config.get('max_workers', 4)
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_file = {
                executor.submit(self.analyzer.analyze_yaml_file, file_path): file_path
                for file_path in yaml_files
            }
            
            for future in as_completed(future_to_file):
                file_path = future_to_file[future]
                try:
                    result = future.result()
                    results.append(result)
                    self.logger.info(f"Analyzed YAML: {Path(file_path).name}")
                except Exception as e:
                    self.logger.error(f"Error analyzing YAML {file_path}: {e}")
        
        return results
    
    def generate_yaml_analysis_report(self, analysis_results: List[YAMLQualityResult]) -> str:
        """Generate comprehensive YAML analysis report"""
        if not analysis_results:
            return "No YAML analysis results to report."
        
        # Calculate summary statistics
        total_files = len(analysis_results)
        avg_overall_quality = sum(r.overall_quality_score for r in analysis_results) / total_files
        avg_kos_compliance = sum(r.kos_compliance_score for r in analysis_results) / total_files
        avg_frontmatter_completeness = sum(r.frontmatter_completeness for r in analysis_results) / total_files
        avg_metadata_quality = sum(r.metadata_quality for r in analysis_results) / total_files
        
        # Count valid YAML files
        valid_yaml_count = sum(1 for r in analysis_results if r.yaml_validity)
        
        # Group by node type
        node_type_stats = {}
        for result in analysis_results:
            if result.node_type not in node_type_stats:
                node_type_stats[result.node_type] = []
            node_type_stats[result.node_type].append(result)
        
        # Find files with highest and lowest quality
        best_file = max(analysis_results, key=lambda x: x.overall_quality_score)
        worst_file = min(analysis_results, key=lambda x: x.overall_quality_score)
        
        # Count total issues
        total_issues = sum(len(r.issues_found) for r in analysis_results)
        
        # Generate report
        report = f"""
# kOS YAML Quality Analysis Report

**Analysis Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Total Files Analyzed**: {total_files}
**Analysis Engine**: Yachay YAML Quality Analyzer

## Summary Statistics

- **Average Overall Quality Score**: {avg_overall_quality:.2%}
- **Average kOS Compliance Score**: {avg_kos_compliance:.2%}
- **Average Frontmatter Completeness**: {avg_frontmatter_completeness:.2%}
- **Average Metadata Quality**: {avg_metadata_quality:.2%}
- **Valid YAML Files**: {valid_yaml_count}/{total_files} ({valid_yaml_count/total_files:.1%})
- **Total Issues Found**: {total_issues}

## Node Type Analysis

"""
        
        # Add node type statistics
        for node_type, results in node_type_stats.items():
            if node_type == "unknown":
                continue
            
            node_avg_quality = sum(r.overall_quality_score for r in results) / len(results)
            node_avg_compliance = sum(r.kos_compliance_score for r in results) / len(results)
            node_valid_count = sum(1 for r in results if r.yaml_validity)
            
            report += f"""
### {node_type.title()} Node
- **Files**: {len(results)}
- **Average Quality**: {node_avg_quality:.2%}
- **Average Compliance**: {node_avg_compliance:.2%}
- **Valid YAML**: {node_valid_count}/{len(results)} ({node_valid_count/len(results):.1%})
"""
        
        report += f"""
## Best Performing File

**File**: {Path(best_file.file_path).name}
**Node Type**: {best_file.node_type.title()}
**Quality Score**: {best_file.overall_quality_score:.2%}
**kOS Compliance**: {best_file.kos_compliance_score:.2%}
**Frontmatter Completeness**: {best_file.frontmatter_completeness:.2%}

## Worst Performing File

**File**: {Path(worst_file.file_path).name}
**Node Type**: {worst_file.node_type.title()}
**Quality Score**: {worst_file.overall_quality_score:.2%}
**kOS Compliance**: {worst_file.kos_compliance_score:.2%}
**Frontmatter Completeness**: {worst_file.frontmatter_completeness:.2%}

## Detailed Results

"""
        
        # Add detailed results for each file
        for result in sorted(analysis_results, key=lambda x: x.overall_quality_score, reverse=True):
            report += f"""
### {Path(result.file_path).name}

- **Node Type**: {result.node_type.title()}
- **Specification Type**: {result.specification_type.replace('_', ' ').title()}
- **Overall Quality Score**: {result.overall_quality_score:.2%}
- **kOS Compliance**: {result.kos_compliance_score:.2%}
- **YAML Validity**: {'✅ Valid' if result.yaml_validity else '❌ Invalid'}
- **Frontmatter Completeness**: {result.frontmatter_completeness:.2%}
- **Metadata Quality**: {result.metadata_quality:.2%}
- **Content Structure Quality**: {result.content_structure_quality:.2%}
- **Analysis Duration**: {result.analysis_duration:.2f}s
- **File Size**: {result.file_size} bytes
- **Word Count**: {result.word_count} words
- **Sections**: {result.section_count}
- **Code Blocks**: {result.code_block_count}
- **Links**: {result.link_count}

#### Issues Found:
{chr(10).join(f"- {issue}" for issue in result.issues_found) if result.issues_found else "- None detected"}

#### Recommendations:
{chr(10).join(f"- {rec}" for rec in result.recommendations) if result.recommendations else "- No recommendations"}

---
"""
        
        # Save report
        report_path = self.output_dir / "kos_yaml_quality_analysis_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        self.logger.info(f"YAML Analysis report saved to: {report_path}")
        return report

def main():
    """Main execution function for kOS YAML analysis"""
    # Configuration
    config = {
        'output_dir': '/Users/danger/CascadeProjects/griot-node/agents/performance',
        'parallel_processing': True,
        'max_workers': 4
    }
    
    # Target directory for kOS node specifications
    target_dir = "/Users/danger/CascadeProjects/griot-node/ai-q/03_node_specifications"
    
    # Check if directory exists
    if not os.path.exists(target_dir):
        print(f"Error: Target directory not found: {target_dir}")
        sys.exit(1)
    
    # Run YAML analysis
    pipeline = KOSYAMLAnalysisPipeline(config)
    results = pipeline.run_yaml_analysis(target_dir)
    
    print(f"\n✅ kOS YAML Analysis completed successfully!")
    print(f"📁 Files analyzed: {results['file_count']}")
    print(f"⏱️  Total duration: {results['total_duration']:.2f} seconds")
    print(f"📊 Report saved to: {config['output_dir']}/kos_yaml_quality_analysis_report.md")
    
    # Show summary of results
    if results['analysis_results']:
        avg_quality = sum(r.overall_quality_score for r in results['analysis_results']) / len(results['analysis_results'])
        avg_compliance = sum(r.kos_compliance_score for r in results['analysis_results']) / len(results['analysis_results'])
        valid_count = sum(1 for r in results['analysis_results'] if r.yaml_validity)
        print(f"📈 Average Quality Score: {avg_quality:.2%}")
        print(f"🎯 Average kOS Compliance: {avg_compliance:.2%}")
        print(f"✅ Valid YAML Files: {valid_count}/{len(results['analysis_results'])} ({valid_count/len(results['analysis_results']):.1%})")

if __name__ == "__main__":
    main() 
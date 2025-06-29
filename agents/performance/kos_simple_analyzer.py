#!/usr/bin/env python3
"""
kOS Simple Content Analysis Engine
Simplified version focusing on core content analysis without complex RAG dependencies.
Specializes in detecting transmission loss, content quality assessment for kOS specifications.
"""

import os
import sys
import yaml
import json
import hashlib
import difflib
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
        logging.FileHandler('/Users/danger/CascadeProjects/griot-node/agents/performance/kos_simple_analysis.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class KOSSimpleAnalysisResult:
    """Data class for storing kOS-specific analysis results"""
    original_file: str
    converted_file: str
    node_type: str
    specification_type: str
    transmission_loss_score: float
    content_preservation_metrics: Dict[str, float]
    structural_changes: List[str]
    quality_assessment: float
    analysis_duration: float
    file_size_original: int
    file_size_converted: int
    word_count_original: int
    word_count_converted: int
    critical_losses: List[str]
    recoverable_content: List[str]
    yaml_frontmatter_quality: float
    kos_compliance_score: float
    timestamp: datetime

class KOSSimpleContentAnalyzer:
    """kOS-specific content analysis module (simplified)"""
    
    def __init__(self):
        self.analysis_cache = {}
        self.logger = logging.getLogger(f"{__name__}.KOSSimpleContentAnalyzer")
        
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
                'database_schema', 'cultural_and_ethical_considerations'
            ]
        }
    
    def analyze_kos_file_pair(self, original_path: str, converted_path: str) -> KOSSimpleAnalysisResult:
        """Analyze a pair of kOS specification files"""
        start_time = time.time()
        
        try:
            # Load file contents
            original_content = self._load_file_content(original_path)
            converted_content = self._load_file_content(converted_path)
            
            # Extract kOS-specific information
            node_type = self._extract_node_type(original_path, converted_path)
            specification_type = self._extract_specification_type(original_path, converted_path)
            
            # Calculate basic metrics
            file_size_original = len(original_content)
            file_size_converted = len(converted_content)
            word_count_original = len(original_content.split())
            word_count_converted = len(converted_content.split())
            
            # Detect transmission loss
            transmission_loss_score = self.detect_transmission_loss(original_content, converted_content)
            
            # Calculate quality metrics
            content_preservation_metrics = self.calculate_kos_quality_metrics(
                original_content, converted_content
            )
            
            # Analyze structural changes
            structural_changes = self.analyze_kos_structural_changes(original_content, converted_content)
            
            # Identify critical losses
            critical_losses = self.identify_kos_critical_losses(original_content, converted_content)
            
            # Identify recoverable content
            recoverable_content = self.identify_kos_recoverable_content(original_content, converted_content)
            
            # Calculate YAML frontmatter quality
            yaml_frontmatter_quality = self._assess_yaml_frontmatter_quality(converted_content)
            
            # Calculate kOS compliance score
            kos_compliance_score = self._calculate_kos_compliance_score(
                converted_content, node_type, specification_type
            )
            
            # Calculate overall quality assessment
            quality_assessment = self.calculate_kos_overall_quality(
                content_preservation_metrics, yaml_frontmatter_quality, kos_compliance_score
            )
            
            analysis_duration = time.time() - start_time
            
            return KOSSimpleAnalysisResult(
                original_file=original_path,
                converted_file=converted_path,
                node_type=node_type,
                specification_type=specification_type,
                transmission_loss_score=transmission_loss_score,
                content_preservation_metrics=content_preservation_metrics,
                structural_changes=structural_changes,
                quality_assessment=quality_assessment,
                analysis_duration=analysis_duration,
                file_size_original=file_size_original,
                file_size_converted=file_size_converted,
                word_count_original=word_count_original,
                word_count_converted=word_count_converted,
                critical_losses=critical_losses,
                recoverable_content=recoverable_content,
                yaml_frontmatter_quality=yaml_frontmatter_quality,
                kos_compliance_score=kos_compliance_score,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            self.logger.error(f"Error analyzing kOS file pair {original_path} -> {converted_path}: {e}")
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
    
    def _extract_node_type(self, original_path: str, converted_path: str) -> str:
        """Extract kOS node type from file path"""
        path = Path(original_path) if os.path.exists(original_path) else Path(converted_path)
        
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
    
    def _extract_specification_type(self, original_path: str, converted_path: str) -> str:
        """Extract kOS specification type from file path"""
        path = Path(original_path) if os.path.exists(original_path) else Path(converted_path)
        filename = path.stem.lower()
        
        # Extract specification type from filename
        for spec_type in self.kos_patterns['kos_specification_types']:
            if spec_type.replace('_', '') in filename.replace('_', ''):
                return spec_type
        
        # Check for numbered specifications
        if re.match(r'\d+_', filename):
            return "numbered_specification"
        
        return "unknown"
    
    def detect_transmission_loss(self, original_content: str, converted_content: str) -> float:
        """Detect content loss during conversion"""
        if not original_content or not converted_content:
            return 1.0  # Complete loss if either content is empty
        
        # Calculate similarity using difflib
        similarity = difflib.SequenceMatcher(None, original_content, converted_content).ratio()
        loss_score = 1.0 - similarity
        
        return loss_score
    
    def calculate_kos_quality_metrics(self, original_content: str, converted_content: str) -> Dict[str, float]:
        """Calculate kOS-specific quality metrics"""
        metrics = {}
        
        # Text similarity
        metrics['text_similarity'] = difflib.SequenceMatcher(None, original_content, converted_content).ratio()
        
        # Structure preservation (compare line structure)
        original_lines = original_content.split('\n')
        converted_lines = converted_content.split('\n')
        structure_similarity = difflib.SequenceMatcher(None, original_lines, converted_lines).ratio()
        metrics['structure_preservation'] = structure_similarity
        
        # Metadata completeness (check for YAML frontmatter)
        metrics['metadata_completeness'] = self._check_kos_metadata_completeness(converted_content)
        
        # Code block integrity
        metrics['code_block_integrity'] = self._check_code_block_integrity(original_content, converted_content)
        
        # Link preservation
        metrics['link_preservation'] = self._check_link_preservation(original_content, converted_content)
        
        # kOS-specific content preservation
        metrics['kos_content_preservation'] = self._check_kos_content_preservation(original_content, converted_content)
        
        return metrics
    
    def _check_kos_metadata_completeness(self, content: str) -> float:
        """Check completeness of kOS YAML frontmatter"""
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
    
    def _check_kos_content_preservation(self, original_content: str, converted_content: str) -> float:
        """Check preservation of kOS-specific content patterns"""
        kos_patterns = [
            r'kOS|kos',  # kOS references
            r'HIEROS',   # HIEROS covenant
            r'Kind Link Framework|KLF',  # KLF references
            r'agent.*specification',  # Agent specifications
            r'node.*architecture',    # Node architecture
            r'cultural.*consideration',  # Cultural considerations
        ]
        
        preserved_patterns = 0
        total_patterns = 0
        
        for pattern in kos_patterns:
            orig_matches = len(re.findall(pattern, original_content, re.IGNORECASE))
            conv_matches = len(re.findall(pattern, converted_content, re.IGNORECASE))
            
            if orig_matches > 0:
                total_patterns += 1
                if conv_matches >= orig_matches * 0.8:  # Allow 20% tolerance
                    preserved_patterns += 1
        
        return preserved_patterns / total_patterns if total_patterns > 0 else 1.0
    
    def _check_code_block_integrity(self, original_content: str, converted_content: str) -> float:
        """Check preservation of code blocks"""
        original_blocks = self._extract_code_blocks(original_content)
        converted_blocks = self._extract_code_blocks(converted_content)
        
        if not original_blocks:
            return 1.0  # No code blocks to preserve
        
        preserved_blocks = 0
        for orig_block in original_blocks:
            for conv_block in converted_blocks:
                if difflib.SequenceMatcher(None, orig_block, conv_block).ratio() > 0.8:
                    preserved_blocks += 1
                    break
        
        return preserved_blocks / len(original_blocks)
    
    def _extract_code_blocks(self, content: str) -> List[str]:
        """Extract code blocks from content"""
        blocks = []
        lines = content.split('\n')
        in_block = False
        current_block = []
        
        for line in lines:
            if line.strip().startswith('```'):
                if in_block:
                    blocks.append('\n'.join(current_block))
                    current_block = []
                    in_block = False
                else:
                    in_block = True
            elif in_block:
                current_block.append(line)
        
        return blocks
    
    def _check_link_preservation(self, original_content: str, converted_content: str) -> float:
        """Check preservation of links"""
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        original_links = re.findall(link_pattern, original_content)
        converted_links = re.findall(link_pattern, converted_content)
        
        if not original_links:
            return 1.0  # No links to preserve
        
        preserved_links = 0
        for orig_link in original_links:
            for conv_link in converted_links:
                if orig_link == conv_link:
                    preserved_links += 1
                    break
        
        return preserved_links / len(original_links)
    
    def analyze_kos_structural_changes(self, original_content: str, converted_content: str) -> List[str]:
        """Analyze kOS-specific structural changes"""
        changes = []
        
        # Check for YAML frontmatter addition
        if not original_content.startswith('---') and converted_content.startswith('---'):
            changes.append("YAML frontmatter added")
        
        # Check for kOS-specific structure changes
        orig_sections = self._extract_sections(original_content)
        conv_sections = self._extract_sections(converted_content)
        
        if len(orig_sections) != len(conv_sections):
            changes.append(f"Section count changed: {len(orig_sections)} -> {len(conv_sections)}")
        
        # Check for metadata structure changes
        if 'metadata:' in converted_content and 'metadata:' not in original_content:
            changes.append("Metadata section added")
        
        # Check for frontmatter structure changes
        if 'frontmatter:' in converted_content and 'frontmatter:' not in original_content:
            changes.append("Frontmatter section added")
        
        return changes
    
    def _extract_sections(self, content: str) -> List[str]:
        """Extract sections from content"""
        import re
        section_pattern = r'^#{1,6}\s+(.+)$'
        return re.findall(section_pattern, content, re.MULTILINE)
    
    def identify_kos_critical_losses(self, original_content: str, converted_content: str) -> List[str]:
        """Identify kOS-specific critical content losses"""
        losses = []
        
        # Check for missing kOS-specific content
        kos_keywords = ['kOS', 'HIEROS', 'Kind Link Framework', 'KLF', 'agent specification']
        for keyword in kos_keywords:
            orig_count = len(re.findall(keyword, original_content, re.IGNORECASE))
            conv_count = len(re.findall(keyword, converted_content, re.IGNORECASE))
            if orig_count > conv_count:
                losses.append(f"Lost {orig_count - conv_count} references to '{keyword}'")
        
        # Check for missing code blocks
        orig_blocks = self._extract_code_blocks(original_content)
        conv_blocks = self._extract_code_blocks(converted_content)
        
        if len(orig_blocks) > len(conv_blocks):
            losses.append(f"Lost {len(orig_blocks) - len(conv_blocks)} code blocks")
        
        # Check for missing links
        import re
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        orig_links = re.findall(link_pattern, original_content)
        conv_links = re.findall(link_pattern, converted_content)
        
        if len(orig_links) > len(conv_links):
            losses.append(f"Lost {len(orig_links) - len(conv_links)} links")
        
        # Check for significant content reduction
        orig_words = len(original_content.split())
        conv_words = len(converted_content.split())
        
        if orig_words > 0 and conv_words / orig_words < 0.8:
            losses.append(f"Significant content reduction: {orig_words} -> {conv_words} words")
        
        return losses
    
    def identify_kos_recoverable_content(self, original_content: str, converted_content: str) -> List[str]:
        """Identify kOS-specific content that could potentially be recovered"""
        recoverable = []
        
        # Check for missing YAML frontmatter that could be generated
        if not converted_content.startswith('---'):
            recoverable.append("YAML frontmatter could be generated from content")
        
        # Check for missing kOS metadata
        if '---' in converted_content:
            try:
                parts = converted_content.split('---', 2)
                frontmatter = yaml.safe_load(parts[1]) or {}
                missing_fields = []
                for field in self.kos_patterns['required_frontmatter_fields']:
                    if field not in frontmatter:
                        missing_fields.append(field)
                if missing_fields:
                    recoverable.append(f"Missing kOS metadata fields: {', '.join(missing_fields)}")
            except:
                pass
        
        # Check for missing cultural context
        if 'cultural' in original_content.lower() and 'cultural' not in converted_content.lower():
            recoverable.append("Cultural context information could be preserved")
        
        return recoverable
    
    def _assess_yaml_frontmatter_quality(self, content: str) -> float:
        """Assess the quality of YAML frontmatter"""
        if not content.startswith('---'):
            return 0.0
        
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1]) or {}
                
                # Check for required fields
                required_fields = self.kos_patterns['required_frontmatter_fields']
                present_fields = sum(1 for field in required_fields if field in frontmatter)
                field_score = present_fields / len(required_fields)
                
                # Check for proper formatting
                formatting_score = 1.0 if 'metadata:' in parts[1] else 0.5
                
                # Check for content quality
                content_score = 1.0
                if 'title' in frontmatter and len(str(frontmatter['title'])) > 0:
                    content_score *= 1.0
                else:
                    content_score *= 0.5
                
                return (field_score + formatting_score + content_score) / 3
        except:
            pass
        
        return 0.0
    
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
        
        return score / total_checks if total_checks > 0 else 0.0
    
    def calculate_kos_overall_quality(self, metrics: Dict[str, float], yaml_quality: float, kos_compliance: float) -> float:
        """Calculate kOS-specific overall quality score"""
        weights = {
            'text_similarity': 0.25,
            'structure_preservation': 0.20,
            'metadata_completeness': 0.15,
            'code_block_integrity': 0.15,
            'link_preservation': 0.10,
            'kos_content_preservation': 0.15
        }
        
        # Calculate weighted score from metrics
        metrics_score = sum(
            metrics.get(metric, 0.0) * weight 
            for metric, weight in weights.items()
        )
        
        # Combine with YAML quality and kOS compliance
        overall_score = (metrics_score * 0.6) + (yaml_quality * 0.2) + (kos_compliance * 0.2)
        
        return min(overall_score, 1.0)  # Cap at 1.0

class KOSSimpleAnalysisPipeline:
    """Main kOS analysis pipeline orchestrator (simplified)"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.content_analyzer = KOSSimpleContentAnalyzer()
        self.logger = logging.getLogger(f"{__name__}.KOSSimpleAnalysisPipeline")
        
        # Create output directory
        self.output_dir = Path(config.get('output_dir', '/Users/danger/CascadeProjects/griot-node/agents/performance'))
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def run_kos_analysis(self, source_dir: str, target_dir: str) -> Dict[str, Any]:
        """Run complete kOS analysis pipeline"""
        start_time = time.time()
        
        self.logger.info(f"Starting kOS analysis: {source_dir} -> {target_dir}")
        
        # Find file pairs
        file_pairs = self._find_kos_file_pairs(source_dir, target_dir)
        self.logger.info(f"Found {len(file_pairs)} kOS file pairs to analyze")
        
        # Run analysis
        analysis_results = []
        if self.config.get('parallel_processing', False):
            analysis_results = self._run_parallel_kos_analysis(file_pairs)
        else:
            analysis_results = self._run_sequential_kos_analysis(file_pairs)
        
        # Generate report
        report = self.generate_kos_analysis_report(analysis_results)
        
        total_duration = time.time() - start_time
        self.logger.info(f"kOS Analysis completed in {total_duration:.2f} seconds")
        
        return {
            'analysis_results': analysis_results,
            'report': report,
            'total_duration': total_duration,
            'file_count': len(file_pairs)
        }
    
    def _find_kos_file_pairs(self, source_dir: str, target_dir: str) -> List[Tuple[str, str]]:
        """Find matching kOS file pairs between source and target directories"""
        source_path = Path(source_dir)
        target_path = Path(target_dir)
        
        file_pairs = []
        
        # Find all markdown files in source
        source_files = list(source_path.rglob("*.md"))
        
        for source_file in source_files:
            # Try to find corresponding YAML file in target
            relative_path = source_file.relative_to(source_path)
            target_file = target_path / relative_path.with_suffix('.yml')
            
            if target_file.exists():
                file_pairs.append((str(source_file), str(target_file)))
            else:
                # Try with different naming patterns
                possible_targets = [
                    target_path / f"{relative_path.stem}.yml",
                    target_path / f"{relative_path.stem}_organized.yml",
                    target_path / relative_path.with_suffix('.yml')
                ]
                
                for possible_target in possible_targets:
                    if possible_target.exists():
                        file_pairs.append((str(source_file), str(possible_target)))
                        break
        
        return file_pairs
    
    def _run_sequential_kos_analysis(self, file_pairs: List[Tuple[str, str]]) -> List[KOSSimpleAnalysisResult]:
        """Run kOS analysis sequentially"""
        results = []
        
        for original_path, converted_path in file_pairs:
            try:
                result = self.content_analyzer.analyze_kos_file_pair(original_path, converted_path)
                results.append(result)
                self.logger.info(f"Analyzed kOS: {Path(original_path).name}")
            except Exception as e:
                self.logger.error(f"Error analyzing kOS {original_path}: {e}")
        
        return results
    
    def _run_parallel_kos_analysis(self, file_pairs: List[Tuple[str, str]]) -> List[KOSSimpleAnalysisResult]:
        """Run kOS analysis in parallel"""
        results = []
        max_workers = self.config.get('max_workers', 4)
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_pair = {
                executor.submit(self.content_analyzer.analyze_kos_file_pair, orig, conv): (orig, conv)
                for orig, conv in file_pairs
            }
            
            for future in as_completed(future_to_pair):
                original_path, converted_path = future_to_pair[future]
                try:
                    result = future.result()
                    results.append(result)
                    self.logger.info(f"Analyzed kOS: {Path(original_path).name}")
                except Exception as e:
                    self.logger.error(f"Error analyzing kOS {original_path}: {e}")
        
        return results
    
    def generate_kos_analysis_report(self, analysis_results: List[KOSSimpleAnalysisResult]) -> str:
        """Generate comprehensive kOS analysis report"""
        if not analysis_results:
            return "No kOS analysis results to report."
        
        # Calculate summary statistics
        total_files = len(analysis_results)
        avg_transmission_loss = sum(r.transmission_loss_score for r in analysis_results) / total_files
        avg_quality = sum(r.quality_assessment for r in analysis_results) / total_files
        avg_kos_compliance = sum(r.kos_compliance_score for r in analysis_results) / total_files
        avg_yaml_quality = sum(r.yaml_frontmatter_quality for r in analysis_results) / total_files
        
        # Group by node type
        node_type_stats = {}
        for result in analysis_results:
            if result.node_type not in node_type_stats:
                node_type_stats[result.node_type] = []
            node_type_stats[result.node_type].append(result)
        
        # Find files with highest and lowest quality
        best_file = max(analysis_results, key=lambda x: x.quality_assessment)
        worst_file = min(analysis_results, key=lambda x: x.quality_assessment)
        
        # Count critical losses
        total_critical_losses = sum(len(r.critical_losses) for r in analysis_results)
        
        # Generate report
        report = f"""
# kOS Node Specifications Analysis Report

**Analysis Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Total Files Analyzed**: {total_files}
**Analysis Engine**: Yachay Content Analysis Engine (kOS Integrated - Simple Version)

## Summary Statistics

- **Average Transmission Loss**: {avg_transmission_loss:.2%}
- **Average Quality Score**: {avg_quality:.2%}
- **Average kOS Compliance Score**: {avg_kos_compliance:.2%}
- **Average YAML Frontmatter Quality**: {avg_yaml_quality:.2%}
- **Total Critical Losses**: {total_critical_losses}

## Node Type Analysis

"""
        
        # Add node type statistics
        for node_type, results in node_type_stats.items():
            if node_type == "unknown":
                continue
            
            node_avg_quality = sum(r.quality_assessment for r in results) / len(results)
            node_avg_compliance = sum(r.kos_compliance_score for r in results) / len(results)
            
            report += f"""
### {node_type.title()} Node
- **Files**: {len(results)}
- **Average Quality**: {node_avg_quality:.2%}
- **Average Compliance**: {node_avg_compliance:.2%}
"""
        
        report += f"""
## Best Performing File

**File**: {Path(best_file.original_file).name}
**Node Type**: {best_file.node_type.title()}
**Quality Score**: {best_file.quality_assessment:.2%}
**kOS Compliance**: {best_file.kos_compliance_score:.2%}
**Transmission Loss**: {best_file.transmission_loss_score:.2%}

## Worst Performing File

**File**: {Path(worst_file.original_file).name}
**Node Type**: {worst_file.node_type.title()}
**Quality Score**: {worst_file.quality_assessment:.2%}
**kOS Compliance**: {worst_file.kos_compliance_score:.2%}
**Transmission Loss**: {worst_file.transmission_loss_score:.2%}

## Detailed Results

"""
        
        # Add detailed results for each file
        for result in sorted(analysis_results, key=lambda x: x.quality_assessment, reverse=True):
            report += f"""
### {Path(result.original_file).name}

- **Node Type**: {result.node_type.title()}
- **Specification Type**: {result.specification_type.replace('_', ' ').title()}
- **Quality Score**: {result.quality_assessment:.2%}
- **kOS Compliance**: {result.kos_compliance_score:.2%}
- **YAML Quality**: {result.yaml_frontmatter_quality:.2%}
- **Transmission Loss**: {result.transmission_loss_score:.2%}
- **Analysis Duration**: {result.analysis_duration:.2f}s
- **File Size**: {result.file_size_original} -> {result.file_size_converted} bytes
- **Word Count**: {result.word_count_original} -> {result.word_count_converted} words

#### Quality Metrics:
- Text Similarity: {result.content_preservation_metrics.get('text_similarity', 0):.2%}
- Structure Preservation: {result.content_preservation_metrics.get('structure_preservation', 0):.2%}
- Metadata Completeness: {result.content_preservation_metrics.get('metadata_completeness', 0):.2%}
- Code Block Integrity: {result.content_preservation_metrics.get('code_block_integrity', 0):.2%}
- Link Preservation: {result.content_preservation_metrics.get('link_preservation', 0):.2%}
- kOS Content Preservation: {result.content_preservation_metrics.get('kos_content_preservation', 0):.2%}

#### Structural Changes:
{chr(10).join(f"- {change}" for change in result.structural_changes) if result.structural_changes else "- None detected"}

#### Critical Losses:
{chr(10).join(f"- {loss}" for loss in result.critical_losses) if result.critical_losses else "- None detected"}

#### Recoverable Content:
{chr(10).join(f"- {content}" for content in result.recoverable_content) if result.recoverable_content else "- None detected"}

---
"""
        
        # Save report
        report_path = self.output_dir / "kos_node_specifications_simple_analysis_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        self.logger.info(f"kOS Analysis report saved to: {report_path}")
        return report

def main():
    """Main execution function for kOS analysis"""
    # Configuration
    config = {
        'output_dir': '/Users/danger/CascadeProjects/griot-node/agents/performance',
        'parallel_processing': True,
        'max_workers': 4
    }
    
    # Source and target directories for kOS node specifications
    source_dir = "/Users/danger/CascadeProjects/griot-node/ai-q/03_node_specifications"
    target_dir = "/Users/danger/CascadeProjects/griot-node/ai-q/03_node_specifications"
    
    # Check if directories exist
    if not os.path.exists(source_dir):
        print(f"Error: Source directory not found: {source_dir}")
        sys.exit(1)
    
    # Run kOS analysis
    pipeline = KOSSimpleAnalysisPipeline(config)
    results = pipeline.run_kos_analysis(source_dir, target_dir)
    
    print(f"\n✅ kOS Analysis completed successfully!")
    print(f"📁 Files analyzed: {results['file_count']}")
    print(f"⏱️  Total duration: {results['total_duration']:.2f} seconds")
    print(f"📊 Report saved to: {config['output_dir']}/kos_node_specifications_simple_analysis_report.md")
    
    # Show summary of results
    if results['analysis_results']:
        avg_quality = sum(r.quality_assessment for r in results['analysis_results']) / len(results['analysis_results'])
        avg_compliance = sum(r.kos_compliance_score for r in results['analysis_results']) / len(results['analysis_results'])
        print(f"📈 Average Quality Score: {avg_quality:.2%}")
        print(f"🎯 Average kOS Compliance: {avg_compliance:.2%}")

if __name__ == "__main__":
    main() 
#!/usr/bin/env python3
"""
Yachay Content Analysis Engine
Learning engine for content analysis, comparison, and vectorization.
Specializes in detecting transmission loss, content quality assessment, and building reusable analysis systems.
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
from dataclasses import dataclass
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# RAG and Vectorization imports
try:
    import chromadb
    from chromadb.config import Settings
    from sentence_transformers import SentenceTransformer
    import numpy as np
    RAG_AVAILABLE = True
except ImportError:
    RAG_AVAILABLE = False
    print("Warning: RAG dependencies not available. Install with: pip install chromadb sentence-transformers")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/Users/danger/CascadeProjects/griot-node/agents/performance/analysis.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class AnalysisResult:
    """Data class for storing analysis results"""
    original_file: str
    converted_file: str
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
    timestamp: datetime

class ContentAnalyzer:
    """Core content analysis module"""
    
    def __init__(self):
        self.analysis_cache = {}
        self.logger = logging.getLogger(f"{__name__}.ContentAnalyzer")
    
    def analyze_file_pair(self, original_path: str, converted_path: str) -> AnalysisResult:
        """Analyze a pair of original and converted files"""
        start_time = time.time()
        
        try:
            # Load file contents
            original_content = self._load_file_content(original_path)
            converted_content = self._load_file_content(converted_path)
            
            # Calculate basic metrics
            file_size_original = len(original_content)
            file_size_converted = len(converted_content)
            word_count_original = len(original_content.split())
            word_count_converted = len(converted_content.split())
            
            # Detect transmission loss
            transmission_loss_score = self.detect_transmission_loss(original_content, converted_content)
            
            # Calculate quality metrics
            content_preservation_metrics = self.calculate_quality_metrics(
                original_content, converted_content
            )
            
            # Analyze structural changes
            structural_changes = self.analyze_structural_changes(original_content, converted_content)
            
            # Identify critical losses
            critical_losses = self.identify_critical_losses(original_content, converted_content)
            
            # Identify recoverable content
            recoverable_content = self.identify_recoverable_content(original_content, converted_content)
            
            # Calculate overall quality assessment
            quality_assessment = self.calculate_overall_quality(content_preservation_metrics)
            
            analysis_duration = time.time() - start_time
            
            return AnalysisResult(
                original_file=original_path,
                converted_file=converted_path,
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
                timestamp=datetime.now()
            )
            
        except Exception as e:
            self.logger.error(f"Error analyzing file pair {original_path} -> {converted_path}: {e}")
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
    
    def detect_transmission_loss(self, original_content: str, converted_content: str) -> float:
        """Detect content loss during conversion"""
        if not original_content or not converted_content:
            return 1.0  # Complete loss if either content is empty
        
        # Calculate similarity using difflib
        similarity = difflib.SequenceMatcher(None, original_content, converted_content).ratio()
        loss_score = 1.0 - similarity
        
        return loss_score
    
    def calculate_quality_metrics(self, original_content: str, converted_content: str) -> Dict[str, float]:
        """Calculate detailed quality metrics"""
        metrics = {}
        
        # Text similarity
        metrics['text_similarity'] = difflib.SequenceMatcher(None, original_content, converted_content).ratio()
        
        # Structure preservation (compare line structure)
        original_lines = original_content.split('\n')
        converted_lines = converted_content.split('\n')
        structure_similarity = difflib.SequenceMatcher(None, original_lines, converted_lines).ratio()
        metrics['structure_preservation'] = structure_similarity
        
        # Metadata completeness (check for YAML frontmatter)
        metrics['metadata_completeness'] = self._check_metadata_completeness(converted_content)
        
        # Code block integrity
        metrics['code_block_integrity'] = self._check_code_block_integrity(original_content, converted_content)
        
        # Link preservation
        metrics['link_preservation'] = self._check_link_preservation(original_content, converted_content)
        
        return metrics
    
    def _check_metadata_completeness(self, content: str) -> float:
        """Check completeness of YAML frontmatter"""
        if not content.startswith('---'):
            return 0.0
        
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1]) or {}
                required_fields = ['title', 'description', 'type', 'status', 'version']
                present_fields = sum(1 for field in required_fields if field in frontmatter)
                return present_fields / len(required_fields)
        except:
            pass
        
        return 0.0
    
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
        import re
        
        # Extract links from both contents
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
    
    def analyze_structural_changes(self, original_content: str, converted_content: str) -> List[str]:
        """Analyze structural changes between original and converted content"""
        changes = []
        
        # Check for YAML frontmatter addition
        if not original_content.startswith('---') and converted_content.startswith('---'):
            changes.append("YAML frontmatter added")
        
        # Check for heading structure changes
        orig_headings = self._extract_headings(original_content)
        conv_headings = self._extract_headings(converted_content)
        
        if len(orig_headings) != len(conv_headings):
            changes.append(f"Heading count changed: {len(orig_headings)} -> {len(conv_headings)}")
        
        # Check for list structure changes
        orig_lists = self._extract_lists(original_content)
        conv_lists = self._extract_lists(converted_content)
        
        if len(orig_lists) != len(conv_lists):
            changes.append(f"List count changed: {len(orig_lists)} -> {len(conv_lists)}")
        
        return changes
    
    def _extract_headings(self, content: str) -> List[str]:
        """Extract headings from content"""
        import re
        heading_pattern = r'^#{1,6}\s+(.+)$'
        return re.findall(heading_pattern, content, re.MULTILINE)
    
    def _extract_lists(self, content: str) -> List[str]:
        """Extract list items from content"""
        import re
        list_pattern = r'^[\s]*[-*+]\s+(.+)$'
        return re.findall(list_pattern, content, re.MULTILINE)
    
    def identify_critical_losses(self, original_content: str, converted_content: str) -> List[str]:
        """Identify critical content losses"""
        losses = []
        
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
    
    def identify_recoverable_content(self, original_content: str, converted_content: str) -> List[str]:
        """Identify content that could potentially be recovered"""
        recoverable = []
        
        # Check for missing YAML frontmatter that could be generated
        if not converted_content.startswith('---'):
            recoverable.append("YAML frontmatter could be generated from content")
        
        # Check for missing metadata
        if '---' in converted_content:
            try:
                parts = converted_content.split('---', 2)
                frontmatter = yaml.safe_load(parts[1]) or {}
                missing_fields = []
                for field in ['title', 'description', 'type', 'status', 'version']:
                    if field not in frontmatter:
                        missing_fields.append(field)
                if missing_fields:
                    recoverable.append(f"Missing metadata fields: {', '.join(missing_fields)}")
            except:
                pass
        
        return recoverable
    
    def calculate_overall_quality(self, metrics: Dict[str, float]) -> float:
        """Calculate overall quality score"""
        weights = {
            'text_similarity': 0.3,
            'structure_preservation': 0.25,
            'metadata_completeness': 0.2,
            'code_block_integrity': 0.15,
            'link_preservation': 0.1
        }
        
        score = sum(
            metrics.get(metric, 0.0) * weight 
            for metric, weight in weights.items()
        )
        
        return min(score, 1.0)  # Cap at 1.0

class VectorizationEngine:
    """Vectorization and RAG integration engine"""
    
    def __init__(self, vector_store_config: Dict[str, Any]):
        self.config = vector_store_config
        self.vector_store = None
        self.embedding_model = None
        self.logger = logging.getLogger(f"{__name__}.VectorizationEngine")
        
        if RAG_AVAILABLE:
            self._initialize_vector_store()
        else:
            self.logger.warning("RAG dependencies not available. Vectorization disabled.")
    
    def _initialize_vector_store(self):
        """Initialize vector store and embedding model"""
        try:
            # Initialize embedding model
            model_name = self.config.get('embedding_model', 'sentence-transformers/all-MiniLM-L6-v2')
            self.embedding_model = SentenceTransformer(model_name)
            
            # Initialize ChromaDB
            persist_directory = self.config.get('persist_directory', './vector_store')
            self.vector_store = chromadb.PersistentClient(
                path=persist_directory,
                settings=Settings(anonymized_telemetry=False)
            )
            
            # Create or get collection
            collection_name = self.config.get('collection_name', 'content_analysis')
            self.collection = self.vector_store.get_or_create_collection(
                name=collection_name,
                metadata={"description": "Content analysis and comparison data"}
            )
            
            self.logger.info(f"Vector store initialized: {persist_directory}")
            
        except Exception as e:
            self.logger.error(f"Error initializing vector store: {e}")
            self.vector_store = None
    
    def vectorize_content(self, content: str, metadata: Dict[str, Any]) -> Optional[str]:
        """Vectorize content and store in vector database"""
        if not self.vector_store or not self.embedding_model:
            return None
        
        try:
            # Generate embedding
            embedding = self.embedding_model.encode(content).tolist()
            
            # Generate unique ID
            content_id = hashlib.md5(content.encode()).hexdigest()
            
            # Store in vector database
            self.collection.add(
                embeddings=[embedding],
                documents=[content],
                metadatas=[metadata],
                ids=[content_id]
            )
            
            return content_id
            
        except Exception as e:
            self.logger.error(f"Error vectorizing content: {e}")
            return None
    
    def semantic_search(self, query: str, top_k: int = 10, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Perform semantic search across vectorized content"""
        if not self.vector_store or not self.embedding_model:
            return []
        
        try:
            # Generate query embedding
            query_embedding = self.embedding_model.encode(query).tolist()
            
            # Perform search
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=filters
            )
            
            # Format results
            formatted_results = []
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    'id': results['ids'][0][i],
                    'document': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'distance': results['distances'][0][i]
                })
            
            return formatted_results
            
        except Exception as e:
            self.logger.error(f"Error performing semantic search: {e}")
            return []

class AnalysisPipeline:
    """Main analysis pipeline orchestrator"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.content_analyzer = ContentAnalyzer()
        self.vectorization_engine = VectorizationEngine(config.get('vector_store', {}))
        self.logger = logging.getLogger(f"{__name__}.AnalysisPipeline")
        
        # Create output directory
        self.output_dir = Path(config.get('output_dir', '/Users/danger/CascadeProjects/griot-node/agents/performance'))
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def run_full_analysis(self, source_dir: str, target_dir: str) -> Dict[str, Any]:
        """Run complete analysis pipeline"""
        start_time = time.time()
        
        self.logger.info(f"Starting full analysis: {source_dir} -> {target_dir}")
        
        # Find file pairs
        file_pairs = self._find_file_pairs(source_dir, target_dir)
        self.logger.info(f"Found {len(file_pairs)} file pairs to analyze")
        
        # Run analysis
        analysis_results = []
        if self.config.get('parallel_processing', False):
            analysis_results = self._run_parallel_analysis(file_pairs)
        else:
            analysis_results = self._run_sequential_analysis(file_pairs)
        
        # Generate report
        report = self.generate_analysis_report(analysis_results)
        
        # Vectorize results if RAG is available
        if RAG_AVAILABLE:
            self._vectorize_results(analysis_results)
        
        total_duration = time.time() - start_time
        self.logger.info(f"Analysis completed in {total_duration:.2f} seconds")
        
        return {
            'analysis_results': analysis_results,
            'report': report,
            'total_duration': total_duration,
            'file_count': len(file_pairs)
        }
    
    def _find_file_pairs(self, source_dir: str, target_dir: str) -> List[Tuple[str, str]]:
        """Find matching file pairs between source and target directories"""
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
                # Try with _organized suffix
                target_file = target_path / f"{relative_path.stem}_organized.yml"
                if target_file.exists():
                    file_pairs.append((str(source_file), str(target_file)))
        
        return file_pairs
    
    def _run_sequential_analysis(self, file_pairs: List[Tuple[str, str]]) -> List[AnalysisResult]:
        """Run analysis sequentially"""
        results = []
        
        for original_path, converted_path in file_pairs:
            try:
                result = self.content_analyzer.analyze_file_pair(original_path, converted_path)
                results.append(result)
                self.logger.info(f"Analyzed: {Path(original_path).name}")
            except Exception as e:
                self.logger.error(f"Error analyzing {original_path}: {e}")
        
        return results
    
    def _run_parallel_analysis(self, file_pairs: List[Tuple[str, str]]) -> List[AnalysisResult]:
        """Run analysis in parallel"""
        results = []
        max_workers = self.config.get('max_workers', 4)
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_pair = {
                executor.submit(self.content_analyzer.analyze_file_pair, orig, conv): (orig, conv)
                for orig, conv in file_pairs
            }
            
            for future in as_completed(future_to_pair):
                original_path, converted_path = future_to_pair[future]
                try:
                    result = future.result()
                    results.append(result)
                    self.logger.info(f"Analyzed: {Path(original_path).name}")
                except Exception as e:
                    self.logger.error(f"Error analyzing {original_path}: {e}")
        
        return results
    
    def _vectorize_results(self, analysis_results: List[AnalysisResult]):
        """Vectorize analysis results for RAG"""
        for result in analysis_results:
            # Vectorize original content
            original_content = self.content_analyzer._load_file_content(result.original_file)
            original_metadata = {
                'file_type': 'original',
                'agent_type': 'skald',
                'analysis_timestamp': result.timestamp.isoformat(),
                'quality_score': result.quality_assessment
            }
            self.vectorization_engine.vectorize_content(original_content, original_metadata)
            
            # Vectorize converted content
            converted_content = self.content_analyzer._load_file_content(result.converted_file)
            converted_metadata = {
                'file_type': 'converted',
                'agent_type': 'skald',
                'analysis_timestamp': result.timestamp.isoformat(),
                'quality_score': result.quality_assessment
            }
            self.vectorization_engine.vectorize_content(converted_content, converted_metadata)
    
    def generate_analysis_report(self, analysis_results: List[AnalysisResult]) -> str:
        """Generate comprehensive analysis report"""
        if not analysis_results:
            return "No analysis results to report."
        
        # Calculate summary statistics
        total_files = len(analysis_results)
        avg_transmission_loss = sum(r.transmission_loss_score for r in analysis_results) / total_files
        avg_quality = sum(r.quality_assessment for r in analysis_results) / total_files
        
        # Find files with highest and lowest quality
        best_file = max(analysis_results, key=lambda x: x.quality_assessment)
        worst_file = min(analysis_results, key=lambda x: x.quality_assessment)
        
        # Count critical losses
        total_critical_losses = sum(len(r.critical_losses) for r in analysis_results)
        
        # Generate report
        report = f"""
# Skald Specification Analysis Report

**Analysis Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Total Files Analyzed**: {total_files}

## Summary Statistics

- **Average Transmission Loss**: {avg_transmission_loss:.2%}
- **Average Quality Score**: {avg_quality:.2%}
- **Total Critical Losses**: {total_critical_losses}

## Best Performing File

**File**: {Path(best_file.original_file).name}
**Quality Score**: {best_file.quality_assessment:.2%}
**Transmission Loss**: {best_file.transmission_loss_score:.2%}

## Worst Performing File

**File**: {Path(worst_file.original_file).name}
**Quality Score**: {worst_file.quality_assessment:.2%}
**Transmission Loss**: {worst_file.transmission_loss_score:.2%}

## Detailed Results

"""
        
        # Add detailed results for each file
        for result in sorted(analysis_results, key=lambda x: x.quality_assessment, reverse=True):
            report += f"""
### {Path(result.original_file).name}

- **Quality Score**: {result.quality_assessment:.2%}
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

#### Structural Changes:
{chr(10).join(f"- {change}" for change in result.structural_changes) if result.structural_changes else "- None detected"}

#### Critical Losses:
{chr(10).join(f"- {loss}" for loss in result.critical_losses) if result.critical_losses else "- None detected"}

#### Recoverable Content:
{chr(10).join(f"- {content}" for content in result.recoverable_content) if result.recoverable_content else "- None detected"}

---
"""
        
        # Save report
        report_path = self.output_dir / "skald_analysis_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        self.logger.info(f"Analysis report saved to: {report_path}")
        return report

def main():
    """Main execution function"""
    # Configuration
    config = {
        'vector_store': {
            'type': 'chroma',
            'persist_directory': '/Users/danger/CascadeProjects/griot-node/agents/performance/vector_store',
            'embedding_model': 'sentence-transformers/all-MiniLM-L6-v2',
            'collection_name': 'skald_analysis'
        },
        'output_dir': '/Users/danger/CascadeProjects/griot-node/agents/performance',
        'parallel_processing': True,
        'max_workers': 4
    }
    
    # Source and target directories
    source_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference/kos_chatgpt/skald"
    target_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference_organized/agent_specifications/skald"
    
    # Check if directories exist
    if not os.path.exists(source_dir):
        print(f"Error: Source directory not found: {source_dir}")
        sys.exit(1)
    
    if not os.path.exists(target_dir):
        print(f"Error: Target directory not found: {target_dir}")
        sys.exit(1)
    
    # Run analysis
    pipeline = AnalysisPipeline(config)
    results = pipeline.run_full_analysis(source_dir, target_dir)
    
    print(f"\n✅ Analysis completed successfully!")
    print(f"📁 Files analyzed: {results['file_count']}")
    print(f"⏱️  Total duration: {results['total_duration']:.2f} seconds")
    print(f"📊 Report saved to: {config['output_dir']}/skald_analysis_report.md")
    
    if RAG_AVAILABLE:
        print(f"🔍 RAG system initialized: {config['vector_store']['persist_directory']}")

if __name__ == "__main__":
    main() 
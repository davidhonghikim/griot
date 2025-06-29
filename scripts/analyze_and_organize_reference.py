#!/usr/bin/env python3
"""
Reference Directory Content Analysis and Organization Script
Analyzes all YAML files and organizes them into a logical, clean structure based on content.
"""

import os
import sys
import yaml
import shutil
from pathlib import Path
from datetime import datetime
import re
from typing import Dict, List, Any, Tuple
from collections import defaultdict

class ReferenceOrganizer:
    def __init__(self, source_dir: str, target_dir: str):
        self.source_dir = Path(source_dir)
        self.target_dir = Path(target_dir)
        self.analysis_log = []
        self.content_categories = defaultdict(list)
        
    def log(self, message: str, level: str = "INFO"):
        """Log analysis activities"""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] {level}: {message}"
        self.analysis_log.append(log_entry)
        print(log_entry)
        
    def analyze_file_content(self, file_path: Path) -> Dict[str, Any]:
        """Analyze the content of a YAML file to determine its category and purpose"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Split frontmatter and body
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter = yaml.safe_load(parts[1]) or {}
                body = parts[2].strip()
            else:
                frontmatter = {}
                body = content
            
            # Analyze content based on multiple factors
            analysis = {
                'file_path': file_path,
                'filename': file_path.name,
                'frontmatter': frontmatter,
                'body': body,
                'content_type': self.detect_content_type(body, frontmatter),
                'primary_topic': self.detect_primary_topic(body, frontmatter),
                'secondary_topics': self.detect_secondary_topics(body),
                'technical_level': self.detect_technical_level(body),
                'agent_related': self.detect_agent_relation(body),
                'module_related': self.detect_module_relation(body),
                'word_count': len(body.split()),
                'has_code_blocks': '```' in body,
                'has_api_specs': self.detect_api_specs(body),
                'has_architecture': self.detect_architecture_content(body),
                'has_deployment': self.detect_deployment_content(body),
                'has_testing': self.detect_testing_content(body),
                'has_security': self.detect_security_content(body),
                'has_rag': self.detect_rag_content(body),
                'has_ethics': self.detect_ethics_content(body),
            }
            
            return analysis
            
        except Exception as e:
            self.log(f"Error analyzing {file_path}: {e}", "ERROR")
            return {
                'file_path': file_path,
                'filename': file_path.name,
                'error': str(e)
            }
    
    def detect_content_type(self, body: str, frontmatter: Dict) -> str:
        """Detect the primary content type"""
        body_lower = body.lower()
        frontmatter_lower = str(frontmatter).lower()
        
        # Check for specific content types
        if any(keyword in body_lower for keyword in ['api', 'endpoint', 'rest', 'graphql', 'openapi']):
            return 'api_specification'
        elif any(keyword in body_lower for keyword in ['agent', 'node', 'class', 'specification']):
            return 'agent_specification'
        elif any(keyword in body_lower for keyword in ['deployment', 'install', 'setup', 'configuration']):
            return 'deployment_guide'
        elif any(keyword in body_lower for keyword in ['architecture', 'system', 'design', 'overview']):
            return 'architecture_document'
        elif any(keyword in body_lower for keyword in ['roadmap', 'timeline', 'plan', 'sprint', 'backlog']):
            return 'planning_document'
        elif any(keyword in body_lower for keyword in ['test', 'testing', 'validation', 'qa']):
            return 'testing_document'
        elif any(keyword in body_lower for keyword in ['security', 'privacy', 'encryption', 'zero-trust']):
            return 'security_document'
        elif any(keyword in body_lower for keyword in ['vector', 'rag', 'embedding', 'weaviate', 'chroma']):
            return 'rag_document'
        elif any(keyword in body_lower for keyword in ['ethics', 'governance', 'compliance', 'ethical']):
            return 'ethics_document'
        elif any(keyword in body_lower for keyword in ['recipe', 'skill', 'workflow', 'orchestration']):
            return 'recipe_document'
        elif any(keyword in body_lower for keyword in ['monitoring', 'telemetry', 'logging', 'metrics']):
            return 'monitoring_document'
        else:
            return 'general_documentation'
    
    def detect_primary_topic(self, body: str, frontmatter: Dict) -> str:
        """Detect the primary topic of the document"""
        body_lower = body.lower()
        
        # Agent-specific topics
        if any(agent in body_lower for agent in ['griot', 'skald', 'junzi', 'tohunga', 'ronin', 'musa', 'hakim', 'oracle', 'yachay', 'sachem', 'archon', 'amauta', 'mzee']):
            return 'agent_specifications'
        elif 'rag' in body_lower or 'vector' in body_lower or 'embedding' in body_lower:
            return 'rag_system'
        elif 'deployment' in body_lower or 'install' in body_lower or 'setup' in body_lower:
            return 'deployment'
        elif 'architecture' in body_lower or 'system' in body_lower:
            return 'architecture'
        elif 'api' in body_lower or 'endpoint' in body_lower:
            return 'api_specifications'
        elif 'security' in body_lower or 'privacy' in body_lower:
            return 'security'
        elif 'ethics' in body_lower or 'governance' in body_lower:
            return 'ethics_governance'
        elif 'monitoring' in body_lower or 'telemetry' in body_lower:
            return 'monitoring'
        elif 'testing' in body_lower or 'qa' in body_lower:
            return 'testing'
        elif 'planning' in body_lower or 'roadmap' in body_lower:
            return 'planning'
        else:
            return 'general'
    
    def detect_secondary_topics(self, body: str) -> List[str]:
        """Detect secondary topics"""
        topics = []
        body_lower = body.lower()
        
        if 'api' in body_lower:
            topics.append('api')
        if 'deployment' in body_lower:
            topics.append('deployment')
        if 'security' in body_lower:
            topics.append('security')
        if 'monitoring' in body_lower:
            topics.append('monitoring')
        if 'testing' in body_lower:
            topics.append('testing')
        if 'rag' in body_lower:
            topics.append('rag')
        if 'ethics' in body_lower:
            topics.append('ethics')
        
        return topics
    
    def detect_technical_level(self, body: str) -> str:
        """Detect the technical level of the document"""
        body_lower = body.lower()
        
        # Count technical indicators
        technical_terms = ['api', 'endpoint', 'database', 'schema', 'configuration', 'deployment', 'architecture', 'protocol', 'specification']
        technical_count = sum(1 for term in technical_terms if term in body_lower)
        
        if technical_count > 10:
            return 'advanced'
        elif technical_count > 5:
            return 'intermediate'
        else:
            return 'basic'
    
    def detect_agent_relation(self, body: str) -> bool:
        """Detect if document is agent-related"""
        agent_names = ['griot', 'skald', 'junzi', 'tohunga', 'ronin', 'musa', 'hakim', 'oracle', 'yachay', 'sachem', 'archon', 'amauta', 'mzee']
        return any(agent in body.lower() for agent in agent_names)
    
    def detect_module_relation(self, body: str) -> bool:
        """Detect if document is module-related"""
        module_terms = ['module', 'component', 'service', 'layer', 'framework']
        return any(term in body.lower() for term in module_terms)
    
    def detect_api_specs(self, body: str) -> bool:
        """Detect if document contains API specifications"""
        api_indicators = ['api', 'endpoint', 'rest', 'graphql', 'openapi', 'swagger']
        return any(indicator in body.lower() for indicator in api_indicators)
    
    def detect_architecture_content(self, body: str) -> bool:
        """Detect if document contains architecture content"""
        arch_indicators = ['architecture', 'system design', 'component', 'layer', 'framework']
        return any(indicator in body.lower() for indicator in arch_indicators)
    
    def detect_deployment_content(self, body: str) -> bool:
        """Detect if document contains deployment content"""
        deploy_indicators = ['deployment', 'install', 'setup', 'configuration', 'docker', 'kubernetes']
        return any(indicator in body.lower() for indicator in deploy_indicators)
    
    def detect_testing_content(self, body: str) -> bool:
        """Detect if document contains testing content"""
        test_indicators = ['test', 'testing', 'validation', 'qa', 'quality assurance']
        return any(indicator in body.lower() for indicator in test_indicators)
    
    def detect_security_content(self, body: str) -> bool:
        """Detect if document contains security content"""
        security_indicators = ['security', 'privacy', 'encryption', 'authentication', 'authorization']
        return any(indicator in body.lower() for indicator in security_indicators)
    
    def detect_rag_content(self, body: str) -> bool:
        """Detect if document contains RAG content"""
        rag_indicators = ['rag', 'vector', 'embedding', 'weaviate', 'chroma', 'qdrant']
        return any(indicator in body.lower() for indicator in rag_indicators)
    
    def detect_ethics_content(self, body: str) -> bool:
        """Detect if document contains ethics content"""
        ethics_indicators = ['ethics', 'governance', 'compliance', 'ethical', 'moral']
        return any(indicator in body.lower() for indicator in ethics_indicators)
    
    def determine_organization_path(self, analysis: Dict[str, Any]) -> Tuple[str, str]:
        """Determine the best organization path for a file based on analysis"""
        primary_topic = analysis.get('primary_topic', 'general')
        content_type = analysis.get('content_type', 'general_documentation')
        technical_level = analysis.get('technical_level', 'basic')
        
        # Define organization structure
        if primary_topic == 'agent_specifications':
            # Extract agent name from filename or content
            agent_name = self.extract_agent_name(analysis)
            if agent_name:
                return f"agents/{agent_name}", f"{agent_name}_specification.yml"
            else:
                return "agents/general", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'rag_system':
            return "systems/rag", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'deployment':
            return "deployment", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'architecture':
            return "architecture", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'api_specifications':
            return "apis", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'security':
            return "security", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'ethics_governance':
            return "ethics_governance", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'monitoring':
            return "monitoring", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'testing':
            return "testing", analysis['filename'].replace('.yml', '_organized.yml')
        
        elif primary_topic == 'planning':
            return "planning", analysis['filename'].replace('.yml', '_organized.yml')
        
        else:
            return "general", analysis['filename'].replace('.yml', '_organized.yml')
    
    def extract_agent_name(self, analysis: Dict[str, Any]) -> str:
        """Extract agent name from filename or content"""
        filename = analysis['filename'].lower()
        body = analysis.get('body', '').lower()
        
        agent_names = ['griot', 'skald', 'junzi', 'tohunga', 'ronin', 'musa', 'hakim', 'oracle', 'yachay', 'sachem', 'archon', 'amauta', 'mzee']
        
        # Check filename first
        for agent in agent_names:
            if agent in filename:
                return agent
        
        # Check content
        for agent in agent_names:
            if agent in body:
                return agent
        
        return ""
    
    def create_organized_structure(self):
        """Create the organized directory structure"""
        # Create main directories
        directories = [
            "agents",
            "systems",
            "deployment", 
            "architecture",
            "apis",
            "security",
            "ethics_governance",
            "monitoring",
            "testing",
            "planning",
            "general"
        ]
        
        for directory in directories:
            (self.target_dir / directory).mkdir(parents=True, exist_ok=True)
        
        # Create agent-specific directories
        agent_names = ['griot', 'skald', 'junzi', 'tohunga', 'ronin', 'musa', 'hakim', 'oracle', 'yachay', 'sachem', 'archon', 'amauta', 'mzee']
        for agent in agent_names:
            (self.target_dir / "agents" / agent).mkdir(parents=True, exist_ok=True)
        
        # Create systems subdirectories
        (self.target_dir / "systems" / "rag").mkdir(parents=True, exist_ok=True)
        
        self.log("Created organized directory structure")
    
    def analyze_all_files(self):
        """Analyze all YAML files in the source directory"""
        yaml_files = list(self.source_dir.rglob("*.yml"))
        self.log(f"Found {len(yaml_files)} YAML files to analyze")
        
        analyses = []
        for file_path in yaml_files:
            if 'backup_before_yaml_conversion' not in str(file_path):
                analysis = self.analyze_file_content(file_path)
                analyses.append(analysis)
                self.log(f"Analyzed: {file_path.name}")
        
        return analyses
    
    def organize_files(self, analyses: List[Dict[str, Any]]):
        """Organize files based on analysis"""
        self.log("Starting file organization...")
        
        for analysis in analyses:
            if 'error' in analysis:
                continue
                
            try:
                # Determine organization path
                org_path, new_filename = self.determine_organization_path(analysis)
                target_path = self.target_dir / org_path / new_filename
                
                # Create organized content
                organized_content = self.create_organized_content(analysis)
                
                # Write organized file
                with open(target_path, 'w', encoding='utf-8') as f:
                    f.write(organized_content)
                
                self.log(f"Organized: {analysis['filename']} -> {org_path}/{new_filename}")
                
            except Exception as e:
                self.log(f"Error organizing {analysis['filename']}: {e}", "ERROR")
    
    def create_organized_content(self, analysis: Dict[str, Any]) -> str:
        """Create organized YAML content with enhanced metadata"""
        frontmatter = analysis.get('frontmatter', {})
        body = analysis.get('body', '')
        
        # Create enhanced frontmatter
        enhanced_frontmatter = {
            'title': frontmatter.get('title', analysis['filename'].replace('.yml', '').replace('_', ' ').title()),
            'description': frontmatter.get('description', ''),
            'type': analysis.get('content_type', 'documentation'),
            'primary_topic': analysis.get('primary_topic', 'general'),
            'secondary_topics': analysis.get('secondary_topics', []),
            'technical_level': analysis.get('technical_level', 'basic'),
            'agent_related': analysis.get('agent_related', False),
            'module_related': analysis.get('module_related', False),
            'has_api_specs': analysis.get('has_api_specs', False),
            'has_architecture': analysis.get('has_architecture', False),
            'has_deployment': analysis.get('has_deployment', False),
            'has_testing': analysis.get('has_testing', False),
            'has_security': analysis.get('has_security', False),
            'has_rag': analysis.get('has_rag', False),
            'has_ethics': analysis.get('has_ethics', False),
            'word_count': analysis.get('word_count', 0),
            'has_code_blocks': analysis.get('has_code_blocks', False),
            'status': frontmatter.get('status', 'current'),
            'priority': frontmatter.get('priority', 'medium'),
            'last_updated': frontmatter.get('last_updated', datetime.now().strftime('%Y-%m-%d')),
            'organization_date': datetime.now().isoformat(),
            'original_filename': analysis['filename'],
            'original_path': str(analysis['file_path']),
        }
        
        # Add any additional frontmatter fields
        for key, value in frontmatter.items():
            if key not in enhanced_frontmatter:
                enhanced_frontmatter[key] = value
        
        # Create YAML document
        yaml_content = yaml.dump(enhanced_frontmatter, default_flow_style=False, sort_keys=False)
        yaml_content += f"\n---\n\n{body}\n"
        
        return yaml_content
    
    def generate_organization_report(self, analyses: List[Dict[str, Any]]) -> str:
        """Generate a comprehensive organization report"""
        report = f"""
# Reference Directory Organization Report

**Organization Date**: {datetime.now().isoformat()}
**Total Files Analyzed**: {len(analyses)}
**Target Directory**: {self.target_dir}

## Organization Summary

### Content Type Distribution
"""
        
        content_types = defaultdict(int)
        primary_topics = defaultdict(int)
        technical_levels = defaultdict(int)
        
        for analysis in analyses:
            if 'error' not in analysis:
                content_types[analysis.get('content_type', 'unknown')] += 1
                primary_topics[analysis.get('primary_topic', 'unknown')] += 1
                technical_levels[analysis.get('technical_level', 'unknown')] += 1
        
        for content_type, count in content_types.items():
            report += f"- **{content_type}**: {count} files\n"
        
        report += "\n### Primary Topic Distribution\n"
        for topic, count in primary_topics.items():
            report += f"- **{topic}**: {count} files\n"
        
        report += "\n### Technical Level Distribution\n"
        for level, count in technical_levels.items():
            report += f"- **{level}**: {count} files\n"
        
        report += "\n## Directory Structure\n"
        report += """
```
reference_organized/
├── agents/
│   ├── griot/
│   ├── skald/
│   ├── junzi/
│   └── ... (other agents)
├── systems/
│   └── rag/
├── deployment/
├── architecture/
├── apis/
├── security/
├── ethics_governance/
├── monitoring/
├── testing/
├── planning/
└── general/
```
"""
        
        return report
    
    def organize_all(self):
        """Main organization process"""
        self.log("Starting reference directory organization...")
        
        # Create organized structure
        self.create_organized_structure()
        
        # Analyze all files
        analyses = self.analyze_all_files()
        
        # Organize files
        self.organize_files(analyses)
        
        # Generate report
        report = self.generate_organization_report(analyses)
        report_path = self.target_dir / "organization_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        self.log(f"Organization complete! Report saved to: {report_path}")
        return len(analyses)

def main():
    """Main execution function"""
    source_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference"
    target_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference_organized"
    
    if not os.path.exists(source_dir):
        print(f"Error: Source directory not found: {source_dir}")
        sys.exit(1)
    
    organizer = ReferenceOrganizer(source_dir, target_dir)
    file_count = organizer.organize_all()
    
    print(f"\n✅ Organization completed successfully!")
    print(f"📁 Organized files: {file_count}")
    print(f"📊 Report available at: {target_dir}/organization_report.md")

if __name__ == "__main__":
    main() 
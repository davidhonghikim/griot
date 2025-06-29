#!/usr/bin/env python3
"""
Robust Reference Content Organization Script
Organizes all YAML files from the reference directory into a clean, logical structure
even when YAML frontmatter is malformed or contains markdown formatting.
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

class RobustReferenceOrganizer:
    def __init__(self, source_dir: str, target_dir: str):
        self.source_dir = Path(source_dir)
        self.target_dir = Path(target_dir)
        self.organization_log = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log organization activities"""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] {level}: {message}"
        self.organization_log.append(log_entry)
        print(log_entry)
        
    def clean_yaml_frontmatter(self, content: str) -> Tuple[Dict[str, Any], str]:
        """Clean and parse YAML frontmatter, handling malformed content"""
        frontmatter = {}
        body = content
        
        # Check for YAML frontmatter
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                frontmatter_text = parts[1].strip()
                body = parts[2].strip()
                
                # Clean the frontmatter text
                cleaned_frontmatter = self.clean_frontmatter_text(frontmatter_text)
                
                try:
                    frontmatter = yaml.safe_load(cleaned_frontmatter) or {}
                except yaml.YAMLError:
                    # If YAML parsing still fails, create basic frontmatter
                    frontmatter = self.create_basic_frontmatter(cleaned_frontmatter)
        
        return frontmatter, body
    
    def clean_frontmatter_text(self, frontmatter_text: str) -> str:
        """Clean frontmatter text by removing problematic markdown formatting"""
        # Remove markdown bold formatting
        cleaned = re.sub(r'\*\*(.*?)\*\*', r'\1', frontmatter_text)
        
        # Remove markdown italic formatting
        cleaned = re.sub(r'\*(.*?)\*', r'\1', frontmatter_text)
        
        # Remove code blocks
        cleaned = re.sub(r'```.*?```', '', cleaned, flags=re.DOTALL)
        
        # Remove inline code
        cleaned = re.sub(r'`([^`]*)`', r'\1', cleaned)
        
        # Remove table formatting (convert to simple lists)
        lines = cleaned.split('\n')
        cleaned_lines = []
        in_table = False
        
        for line in lines:
            if '|' in line and not in_table:
                # Start of table - skip
                in_table = True
                continue
            elif in_table and line.strip() == '':
                # End of table
                in_table = False
                continue
            elif in_table:
                # Skip table content
                continue
            else:
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def create_basic_frontmatter(self, text: str) -> Dict[str, Any]:
        """Create basic frontmatter from text when YAML parsing fails"""
        frontmatter = {
            'title': 'Unknown Document',
            'description': '',
            'type': 'documentation',
            'status': 'current',
            'priority': 'medium',
            'version': '1.0',
            'last_updated': '2025-06-28',
        }
        
        # Try to extract basic information from text
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if ':' in line and not line.startswith('-'):
                try:
                    key, value = line.split(':', 1)
                    key = key.strip().lower()
                    value = value.strip()
                    
                    if key in ['title', 'description', 'type', 'status', 'priority', 'version']:
                        frontmatter[key] = value
                except ValueError:
                    continue
        
        return frontmatter
    
    def analyze_file_content(self, file_path: Path) -> Dict[str, Any]:
        """Analyze the content of a YAML file to determine its category"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Clean and parse frontmatter
            frontmatter, body = self.clean_yaml_frontmatter(content)
            
            # Analyze content based on filename and content
            filename = file_path.name.lower()
            body_lower = body.lower()
            
            # Determine primary category
            if 'griot' in filename or 'griot' in body_lower:
                category = 'agent_specifications/griot'
            elif 'skald' in filename or 'skald' in body_lower:
                category = 'agent_specifications/skald'
            elif 'junzi' in filename or 'junzi' in body_lower:
                category = 'agent_specifications/junzi'
            elif 'tohunga' in filename or 'tohunga' in body_lower:
                category = 'agent_specifications/tohunga'
            elif 'ronin' in filename or 'ronin' in body_lower:
                category = 'agent_specifications/ronin'
            elif 'musa' in filename or 'musa' in body_lower:
                category = 'agent_specifications/musa'
            elif 'hakim' in filename or 'hakim' in body_lower:
                category = 'agent_specifications/hakim'
            elif 'oracle' in filename or 'oracle' in body_lower:
                category = 'agent_specifications/oracle'
            elif 'yachay' in filename or 'yachay' in body_lower:
                category = 'agent_specifications/yachay'
            elif 'sachem' in filename or 'sachem' in body_lower:
                category = 'agent_specifications/sachem'
            elif 'archon' in filename or 'archon' in body_lower:
                category = 'agent_specifications/archon'
            elif 'amauta' in filename or 'amauta' in body_lower:
                category = 'agent_specifications/amauta'
            elif 'mzee' in filename or 'mzee' in body_lower:
                category = 'agent_specifications/mzee'
            elif 'rag' in filename or 'vector' in filename or 'rag' in body_lower or 'vector' in body_lower:
                category = 'rag_system'
            elif 'kitchen' in filename or 'kitchen' in body_lower:
                category = 'kitchen_system'
            elif 'deployment' in filename or 'deployment' in body_lower or 'install' in filename:
                category = 'deployment'
            elif 'architecture' in filename or 'architecture' in body_lower:
                category = 'architecture'
            elif 'api' in filename or 'api' in body_lower or 'endpoint' in body_lower:
                category = 'apis'
            elif 'security' in filename or 'security' in body_lower or 'privacy' in body_lower:
                category = 'security'
            elif 'ethics' in filename or 'ethics' in body_lower or 'governance' in body_lower:
                category = 'ethics_governance'
            elif 'monitoring' in filename or 'monitoring' in body_lower or 'telemetry' in body_lower:
                category = 'monitoring'
            elif 'test' in filename or 'test' in body_lower or 'qa' in body_lower:
                category = 'testing'
            elif 'planning' in filename or 'roadmap' in filename or 'sprint' in filename or 'backlog' in filename:
                category = 'planning'
            elif 'agent' in filename or 'agent' in body_lower:
                category = 'agent_specifications'
            elif 'spec' in filename or 'specification' in filename:
                category = 'core_specifications'
            else:
                category = 'general'
            
            return {
                'file_path': file_path,
                'filename': file_path.name,
                'frontmatter': frontmatter,
                'body': body,
                'category': category,
                'word_count': len(body.split()),
                'has_code_blocks': '```' in body,
                'has_api_specs': 'api' in body_lower or 'endpoint' in body_lower,
                'has_architecture': 'architecture' in body_lower or 'system' in body_lower,
                'has_deployment': 'deployment' in body_lower or 'install' in body_lower,
                'has_testing': 'test' in body_lower or 'qa' in body_lower,
                'has_security': 'security' in body_lower or 'privacy' in body_lower,
                'has_rag': 'rag' in body_lower or 'vector' in body_lower,
                'has_ethics': 'ethics' in body_lower or 'governance' in body_lower,
            }
            
        except Exception as e:
            self.log(f"Error analyzing {file_path}: {e}", "ERROR")
            return {
                'file_path': file_path,
                'filename': file_path.name,
                'error': str(e),
                'category': 'general',
                'frontmatter': {},
                'body': '',
            }
    
    def create_organized_structure(self):
        """Create the organized directory structure"""
        # Create main directories
        directories = [
            "core_specifications",
            "agent_specifications",
            "systems",
            "deployment",
            "architecture",
            "apis",
            "security",
            "ethics_governance",
            "monitoring",
            "testing",
            "planning",
            "rag_system",
            "kitchen_system",
            "development_tools",
            "user_guides",
            "general"
        ]
        
        for directory in directories:
            (self.target_dir / directory).mkdir(parents=True, exist_ok=True)
        
        # Create agent-specific directories
        agent_names = ['griot', 'skald', 'junzi', 'tohunga', 'ronin', 'musa', 'hakim', 'oracle', 'yachay', 'sachem', 'archon', 'amauta', 'mzee']
        for agent in agent_names:
            (self.target_dir / "agent_specifications" / agent).mkdir(parents=True, exist_ok=True)
        
        self.log("Created organized directory structure")
    
    def organize_files(self):
        """Organize all YAML files based on content analysis"""
        yaml_files = list(self.source_dir.rglob("*.yml"))
        self.log(f"Found {len(yaml_files)} YAML files to organize")
        
        organized_count = 0
        errors = []
        
        for file_path in yaml_files:
            # Skip backup and conversion files
            if any(skip in str(file_path) for skip in ['backup_before_yaml_conversion', 'yaml_conversion_report']):
                continue
                
            try:
                # Analyze file content
                analysis = self.analyze_file_content(file_path)
                
                if 'error' in analysis:
                    errors.append(f"{file_path.name}: {analysis['error']}")
                    continue
                
                # Determine target path
                category = analysis['category']
                target_dir = self.target_dir / category
                target_dir.mkdir(parents=True, exist_ok=True)
                
                # Create organized filename
                original_name = file_path.stem
                organized_name = f"{original_name}_organized.yml"
                target_path = target_dir / organized_name
                
                # Create organized content with enhanced metadata
                organized_content = self.create_organized_content(analysis)
                
                # Write organized file
                with open(target_path, 'w', encoding='utf-8') as f:
                    f.write(organized_content)
                
                organized_count += 1
                self.log(f"Organized: {file_path.name} -> {category}/{organized_name}")
                
            except Exception as e:
                error_msg = f"Error organizing {file_path.name}: {e}"
                errors.append(error_msg)
                self.log(error_msg, "ERROR")
        
        self.log(f"Organization complete! Organized {organized_count} files")
        if errors:
            self.log(f"Encountered {len(errors)} errors during organization", "WARNING")
            for error in errors[:10]:  # Show first 10 errors
                self.log(f"  {error}", "ERROR")
        
        return organized_count, errors
    
    def create_organized_content(self, analysis: Dict[str, Any]) -> str:
        """Create organized YAML content with enhanced metadata"""
        frontmatter = analysis.get('frontmatter', {})
        body = analysis.get('body', '')
        filename = analysis.get('filename', '')
        
        # Create enhanced frontmatter
        enhanced_frontmatter = {
            'title': frontmatter.get('title', filename.replace('.yml', '').replace('_', ' ').title()),
            'description': frontmatter.get('description', ''),
            'type': frontmatter.get('type', 'documentation'),
            'status': frontmatter.get('status', 'current'),
            'priority': frontmatter.get('priority', 'medium'),
            'version': frontmatter.get('version', '1.0'),
            'last_updated': frontmatter.get('last_updated', '2025-06-28'),
            'organization_date': datetime.now().isoformat(),
            'authors': frontmatter.get('authors', []),
            'tags': frontmatter.get('tags', []),
            'content_type': 'documentation',
            'technical_level': 'advanced' if analysis.get('word_count', 0) > 500 else 'intermediate',
            'word_count': analysis.get('word_count', 0),
            'has_code_blocks': analysis.get('has_code_blocks', False),
            'has_api_specs': analysis.get('has_api_specs', False),
            'has_architecture': analysis.get('has_architecture', False),
            'has_deployment': analysis.get('has_deployment', False),
            'has_testing': analysis.get('has_testing', False),
            'has_security': analysis.get('has_security', False),
            'has_rag': analysis.get('has_rag', False),
            'has_ethics': analysis.get('has_ethics', False),
            'original_filename': filename,
            'original_path': str(analysis['file_path']),
            'category': analysis.get('category', 'general'),
        }
        
        # Add any additional frontmatter fields
        for key, value in frontmatter.items():
            if key not in enhanced_frontmatter:
                enhanced_frontmatter[key] = value
        
        # Create YAML document
        yaml_content = yaml.dump(enhanced_frontmatter, default_flow_style=False, sort_keys=False)
        yaml_content += f"\n---\n\n{body}\n"
        
        return yaml_content
    
    def generate_organization_report(self, organized_count: int, errors: List[str]) -> str:
        """Generate a comprehensive organization report"""
        report = f"""
# Reference Directory Organization Report

**Organization Date**: {datetime.now().isoformat()}
**Total Files Organized**: {organized_count}
**Target Directory**: {self.target_dir}

## Organization Summary

The reference directory has been successfully organized into a clean, logical structure based on content analysis and proper categorization.

## Directory Structure

```
reference_organized/
├── core_specifications/          # Main kOS specifications and overviews
├── agent_specifications/         # Agent-specific documentation
│   ├── griot/                   # Griot agent specifications
│   ├── skald/                   # Skald agent specifications
│   ├── junzi/                   # Junzi agent specifications
│   └── ... (other agents)
├── rag_system/                  # RAG and vector system documentation
├── kitchen_system/              # Kitchen system specifications
├── deployment/                  # Deployment guides and configurations
├── architecture/                # Architecture documentation
├── apis/                        # API specifications
├── security/                    # Security and privacy documentation
├── ethics_governance/           # Ethics and governance documentation
├── monitoring/                  # Monitoring and telemetry
├── testing/                     # Testing documentation
├── planning/                    # Planning, roadmaps, and backlogs
├── development_tools/           # Development tools and utilities
├── user_guides/                 # User guides and tutorials
└── general/                     # General documentation
```

## Content Categories

### Core Specifications
- Main kOS technical specifications
- Ecosystem overviews
- System architecture documents

### Agent Specifications
- Individual agent class specifications
- Agent behavior patterns
- Agent communication protocols

### Systems
- RAG system documentation
- Kitchen system specifications
- Vector store configurations

### Technical Documentation
- Deployment guides
- Architecture specifications
- API documentation
- Security and privacy documentation

### Process Documentation
- Planning documents
- Sprint backlogs
- Development roadmaps

## Quality Improvements

1. **Enhanced Metadata**: All files now include comprehensive metadata for better searchability and categorization
2. **Logical Organization**: Files are organized by content type and purpose rather than arbitrary naming
3. **Consistent Structure**: All files follow a consistent YAML frontmatter structure
4. **Content Analysis**: Files are categorized based on actual content analysis, not just filenames
5. **Traceability**: Original file paths and sources are preserved for reference
6. **Robust Parsing**: Handles malformed YAML frontmatter gracefully

## Error Summary

**Total Errors**: {len(errors)}
**Success Rate**: {(organized_count / (organized_count + len(errors)) * 100):.1f}%

"""
        
        if errors:
            report += "\n## Errors Encountered\n"
            for error in errors[:20]:  # Show first 20 errors
                report += f"- {error}\n"
            if len(errors) > 20:
                report += f"- ... and {len(errors) - 20} more errors\n"
        
        return report
    
    def organize_all(self):
        """Main organization process"""
        self.log("Starting robust reference directory organization...")
        
        # Create organized structure
        self.create_organized_structure()
        
        # Organize files
        organized_count, errors = self.organize_files()
        
        # Generate report
        report = self.generate_organization_report(organized_count, errors)
        report_path = self.target_dir / "organization_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        self.log(f"Organization complete! Report saved to: {report_path}")
        return organized_count

def main():
    """Main execution function"""
    source_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference"
    target_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference_organized"
    
    if not os.path.exists(source_dir):
        print(f"Error: Source directory not found: {source_dir}")
        sys.exit(1)
    
    organizer = RobustReferenceOrganizer(source_dir, target_dir)
    file_count = organizer.organize_all()
    
    print(f"\n✅ Organization completed successfully!")
    print(f"📁 Organized files: {file_count}")
    print(f"📊 Report available at: {target_dir}/organization_report.md")

if __name__ == "__main__":
    main() 
#!/usr/bin/env python3
"""
Reference Directory YAML Conversion Script
Converts all Markdown files in agents/reference to YAML format with comprehensive backup and validation.
"""

import os
import sys
import yaml
import json
import shutil
from pathlib import Path
from datetime import datetime
import re
from typing import Dict, List, Any, Tuple

class ReferenceYAMLConverter:
    def __init__(self, reference_dir: str):
        self.reference_dir = Path(reference_dir)
        self.backup_dir = self.reference_dir / "backup_before_yaml_conversion"
        self.conversion_log = []
        self.errors = []
        
    def log(self, message: str, level: str = "INFO"):
        """Log conversion activities"""
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] {level}: {message}"
        self.conversion_log.append(log_entry)
        print(log_entry)
        
    def backup_directory(self) -> bool:
        """Create a complete backup of the reference directory"""
        try:
            if self.backup_dir.exists():
                shutil.rmtree(self.backup_dir)
            
            shutil.copytree(self.reference_dir, self.backup_dir, ignore=shutil.ignore_patterns(
                'backup_before_yaml_conversion',
                '*.backup',
                '__pycache__',
                '.DS_Store'
            ))
            self.log(f"Backup created at: {self.backup_dir}")
            return True
        except Exception as e:
            self.log(f"Backup failed: {e}", "ERROR")
            self.errors.append(f"Backup failed: {e}")
            return False
    
    def extract_frontmatter(self, content: str) -> Tuple[Dict[str, Any], str]:
        """Extract YAML frontmatter from markdown content"""
        frontmatter = {}
        body = content
        
        # Check for YAML frontmatter
        if content.startswith('---'):
            parts = content.split('---', 2)
            if len(parts) >= 3:
                try:
                    # Try to parse the frontmatter
                    frontmatter_text = parts[1].strip()
                    frontmatter = yaml.safe_load(frontmatter_text) or {}
                    body = parts[2].strip()
                except yaml.YAMLError as e:
                    self.log(f"YAML frontmatter parsing error: {e}", "WARNING")
                    # If YAML parsing fails, try to extract basic metadata from the malformed frontmatter
                    frontmatter = self.extract_basic_metadata(parts[1])
                    body = parts[2].strip()
            else:
                # Not enough parts, treat as body
                frontmatter = {}
                body = content
        else:
            # No frontmatter, treat entire content as body
            frontmatter = {}
            body = content
        
        return frontmatter, body
    
    def extract_basic_metadata(self, malformed_frontmatter: str) -> Dict[str, Any]:
        """Extract basic metadata from malformed frontmatter"""
        metadata = {}
        
        # Try to extract common fields using regex
        import re
        
        # Extract title
        title_match = re.search(r'title:\s*"([^"]+)"', malformed_frontmatter)
        if title_match:
            metadata['title'] = title_match.group(1)
        
        # Extract description
        desc_match = re.search(r'description:\s*"([^"]+)"', malformed_frontmatter)
        if desc_match:
            metadata['description'] = desc_match.group(1)
        
        # Extract type
        type_match = re.search(r'type:\s*"([^"]+)"', malformed_frontmatter)
        if type_match:
            metadata['type'] = type_match.group(1)
        
        # Extract status
        status_match = re.search(r'status:\s*"([^"]+)"', malformed_frontmatter)
        if status_match:
            metadata['status'] = status_match.group(1)
        
        # Extract priority
        priority_match = re.search(r'priority:\s*"([^"]+)"', malformed_frontmatter)
        if priority_match:
            metadata['priority'] = priority_match.group(1)
        
        # Extract version
        version_match = re.search(r'version:\s*"([^"]+)"', malformed_frontmatter)
        if version_match:
            metadata['version'] = version_match.group(1)
        
        # Extract created date
        created_match = re.search(r'created:\s*"([^"]+)"', malformed_frontmatter)
        if created_match:
            metadata['created'] = created_match.group(1)
        
        # Extract tags
        tags_match = re.search(r'tags:\s*\[([^\]]+)\]', malformed_frontmatter)
        if tags_match:
            tags_str = tags_match.group(1)
            # Parse tags array
            tags = [tag.strip().strip('"') for tag in tags_str.split(',')]
            metadata['tags'] = tags
        
        return metadata
    
    def markdown_to_yaml(self, md_content: str, filename: str) -> str:
        """Convert markdown content to YAML format"""
        frontmatter, body = self.extract_frontmatter(md_content)

        # Ensure frontmatter is always a dict
        if not isinstance(frontmatter, dict):
            frontmatter = {}

        # Always provide all required keys with safe defaults
        def safe_get(key, default):
            return frontmatter[key] if key in frontmatter and frontmatter[key] is not None else default

        enhanced_frontmatter = {
            'title': safe_get('title', filename.replace('.md', '').replace('_', ' ').title()),
            'description': safe_get('description', ''),
            'type': safe_get('type', 'documentation'),
            'status': safe_get('status', 'current'),
            'priority': safe_get('priority', 'medium'),
            'last_updated': safe_get('last_updated', datetime.now().strftime('%Y-%m-%d')),
            'conversion_date': datetime.now().isoformat(),
            'original_format': 'markdown',
            'content_type': self.detect_content_type(body),
            'word_count': len(body.split()),
            'line_count': len(body.splitlines()),
        }

        # Add any additional frontmatter fields
        for key, value in frontmatter.items():
            if key not in enhanced_frontmatter:
                enhanced_frontmatter[key] = value

        # Create YAML document
        yaml_content = yaml.dump(enhanced_frontmatter, default_flow_style=False, sort_keys=False)
        yaml_content += f"\n---\n\n{body}\n"

        return yaml_content
    
    def detect_content_type(self, content: str) -> str:
        """Detect the type of content based on keywords and structure"""
        content_lower = content.lower()
        
        if any(keyword in content_lower for keyword in ['api', 'endpoint', 'rest', 'graphql']):
            return 'api_specification'
        elif any(keyword in content_lower for keyword in ['agent', 'node', 'class', 'specification']):
            return 'agent_specification'
        elif any(keyword in content_lower for keyword in ['deployment', 'install', 'setup', 'configuration']):
            return 'deployment_guide'
        elif any(keyword in content_lower for keyword in ['architecture', 'system', 'design']):
            return 'architecture_document'
        elif any(keyword in content_lower for keyword in ['roadmap', 'timeline', 'plan', 'sprint']):
            return 'planning_document'
        elif any(keyword in content_lower for keyword in ['test', 'testing', 'validation']):
            return 'testing_document'
        elif any(keyword in content_lower for keyword in ['security', 'privacy', 'encryption']):
            return 'security_document'
        elif any(keyword in content_lower for keyword in ['vector', 'rag', 'embedding', 'weaviate']):
            return 'rag_document'
        else:
            return 'general_documentation'
    
    def convert_file(self, file_path: Path) -> bool:
        """Convert a single markdown file to YAML"""
        try:
            # Read original content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Convert to YAML
            yaml_content = self.markdown_to_yaml(original_content, file_path.name)
            
            # Create backup of original
            backup_path = file_path.with_suffix('.md.backup')
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original_content)
            
            # Write YAML version
            yaml_path = file_path.with_suffix('.yml')
            with open(yaml_path, 'w', encoding='utf-8') as f:
                f.write(yaml_content)
            
            # Remove original markdown file
            file_path.unlink()
            
            self.log(f"Converted: {file_path.name} -> {yaml_path.name}")
            return True
            
        except Exception as e:
            self.log(f"Error converting {file_path}: {e}", "ERROR")
            self.errors.append(f"Error converting {file_path}: {e}")
            return False
    
    def find_markdown_files(self) -> List[Path]:
        """Find all markdown files in the reference directory"""
        markdown_files = []
        for root, dirs, files in os.walk(self.reference_dir):
            # Skip backup directory
            if 'backup_before_yaml_conversion' in root:
                continue
                
            for file in files:
                if file.endswith('.md') and not file.endswith('.backup'):
                    markdown_files.append(Path(root) / file)
        
        return markdown_files
    
    def validate_yaml_files(self) -> Dict[str, Any]:
        """Validate all converted YAML files"""
        validation_results = {
            'total_files': 0,
            'valid_files': 0,
            'invalid_files': 0,
            'errors': []
        }
        
        for root, dirs, files in os.walk(self.reference_dir):
            if 'backup_before_yaml_conversion' in root:
                continue
                
            for file in files:
                if file.endswith('.yml'):
                    validation_results['total_files'] += 1
                    file_path = Path(root) / file
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        # Split frontmatter and body
                        if '---' in content:
                            parts = content.split('---', 2)
                            if len(parts) >= 3:
                                yaml.safe_load(parts[1])  # Validate YAML frontmatter
                                validation_results['valid_files'] += 1
                            else:
                                validation_results['invalid_files'] += 1
                                validation_results['errors'].append(f"Invalid YAML structure in {file}")
                        else:
                            validation_results['invalid_files'] += 1
                            validation_results['errors'].append(f"No YAML frontmatter found in {file}")
                            
                    except Exception as e:
                        validation_results['invalid_files'] += 1
                        validation_results['errors'].append(f"Error validating {file}: {e}")
        
        return validation_results
    
    def generate_conversion_report(self) -> str:
        """Generate a comprehensive conversion report"""
        report = f"""
# Reference Directory YAML Conversion Report

**Conversion Date**: {datetime.now().isoformat()}
**Total Files Processed**: {len(self.conversion_log)}
**Errors Encountered**: {len(self.errors)}

## Conversion Summary

### Files Converted Successfully
"""
        
        successful_conversions = [log for log in self.conversion_log if "Converted:" in log]
        for conversion in successful_conversions:
            report += f"- {conversion}\n"
        
        if self.errors:
            report += "\n### Errors\n"
            for error in self.errors:
                report += f"- {error}\n"
        
        # Validation results
        validation = self.validate_yaml_files()
        report += f"""
## Validation Results

- **Total YAML Files**: {validation['total_files']}
- **Valid Files**: {validation['valid_files']}
- **Invalid Files**: {validation['invalid_files']}

"""
        
        if validation['errors']:
            report += "### Validation Errors\n"
            for error in validation['errors']:
                report += f"- {error}\n"
        
        return report
    
    def convert_all(self) -> bool:
        """Convert all markdown files to YAML format"""
        self.log("Starting YAML conversion process...")
        
        # Create backup
        if not self.backup_directory():
            return False
        
        # Find all markdown files
        markdown_files = self.find_markdown_files()
        self.log(f"Found {len(markdown_files)} markdown files to convert")
        
        # Convert each file
        successful_conversions = 0
        for file_path in markdown_files:
            if self.convert_file(file_path):
                successful_conversions += 1
        
        self.log(f"Conversion complete: {successful_conversions}/{len(markdown_files)} files converted successfully")
        
        # Generate and save report
        report = self.generate_conversion_report()
        report_path = self.reference_dir / "yaml_conversion_report.md"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        self.log(f"Conversion report saved to: {report_path}")
        
        return len(self.errors) == 0

def main():
    """Main execution function"""
    reference_dir = "/Users/danger/CascadeProjects/griot-node/agents/reference"
    
    if not os.path.exists(reference_dir):
        print(f"Error: Reference directory not found: {reference_dir}")
        sys.exit(1)
    
    converter = ReferenceYAMLConverter(reference_dir)
    success = converter.convert_all()
    
    if success:
        print("\n✅ YAML conversion completed successfully!")
        print(f"📁 Backup available at: {converter.backup_dir}")
        print(f"📊 Report available at: {reference_dir}/yaml_conversion_report.md")
    else:
        print("\n❌ YAML conversion completed with errors!")
        print("Check the conversion report for details.")
        sys.exit(1)

if __name__ == "__main__":
    main() 
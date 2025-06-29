#!/usr/bin/env python3
"""
Comprehensive Markdown to YAML Converter for ai-q Directory
Converts all .md files in the ai-q directory tree to YAML format
"""

import os
import re
import yaml
import glob
from pathlib import Path
from typing import Dict, Any, List, Optional

def extract_frontmatter(content: str) -> tuple[Optional[Dict[str, Any]], str]:
    """Extract YAML frontmatter from markdown content."""
    if not content.startswith('---'):
        return None, content
    
    lines = content.split('\n')
    if len(lines) < 2:
        return None, content
    
    frontmatter_lines = []
    body_lines = []
    in_frontmatter = False
    frontmatter_end = -1
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if not in_frontmatter:
                in_frontmatter = True
                frontmatter_lines.append(line)
            else:
                frontmatter_end = i
                break
        elif in_frontmatter:
            frontmatter_lines.append(line)
        else:
            body_lines.append(line)
    
    if frontmatter_end == -1:
        return None, content
    
    # Parse frontmatter
    try:
        frontmatter_content = '\n'.join(frontmatter_lines[1:])  # Skip first ---
        frontmatter = yaml.safe_load(frontmatter_content) if frontmatter_content.strip() else {}
    except yaml.YAMLError:
        frontmatter = {}
    
    # Get body content
    body = '\n'.join(lines[frontmatter_end + 1:])
    
    return frontmatter, body

def markdown_to_yaml_structure(content: str, filename: str) -> Dict[str, Any]:
    """Convert markdown content to YAML structure."""
    frontmatter, body = extract_frontmatter(content)
    
    # Initialize YAML structure
    yaml_data = {
        'metadata': {
            'original_file': filename,
            'conversion_date': '2025-06-30T11:00:00Z',
            'format': 'yaml'
        }
    }
    
    # Add frontmatter if it exists
    if frontmatter:
        yaml_data['frontmatter'] = frontmatter
    
    # Parse markdown structure
    lines = body.split('\n')
    sections = []
    current_section = None
    current_content = []
    
    for line in lines:
        # Check for headers
        header_match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if header_match:
            # Save previous section
            if current_section:
                current_section['content'] = '\n'.join(current_content).strip()
                sections.append(current_section)
            
            # Start new section
            level = len(header_match.group(1))
            title = header_match.group(2).strip()
            current_section = {
                'level': level,
                'title': title,
                'type': 'section'
            }
            current_content = []
        else:
            # Check for code blocks
            if line.startswith('```'):
                current_content.append(line)
                # Skip until end of code block
                continue
            elif line.strip() == '':
                current_content.append(line)
            else:
                current_content.append(line)
    
    # Add final section
    if current_section:
        current_section['content'] = '\n'.join(current_content).strip()
        sections.append(current_section)
    
    # Add sections to YAML data
    if sections:
        yaml_data['sections'] = sections
    
    # If no sections found, treat entire body as content
    if not sections and body.strip():
        yaml_data['content'] = body.strip()
    
    return yaml_data

def convert_file(md_path: str) -> bool:
    """Convert a single markdown file to YAML."""
    try:
        # Read markdown file
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert to YAML structure
        yaml_data = markdown_to_yaml_structure(content, os.path.basename(md_path))
        
        # Create YAML file path
        yaml_path = md_path.replace('.md', '.yml')
        
        # Write YAML file
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        
        # Verify YAML is valid
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        
        return True
    except Exception as e:
        print(f"Error converting {md_path}: {e}")
        return False

def main():
    """Main conversion function."""
    aiq_dir = "ai-q"
    
    if not os.path.exists(aiq_dir):
        print(f"Directory {aiq_dir} not found!")
        return
    
    # Find all markdown files
    md_files = []
    for root, dirs, files in os.walk(aiq_dir):
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    
    print(f"Found {len(md_files)} markdown files to convert")
    
    # Convert files
    successful = 0
    failed = 0
    
    for i, md_file in enumerate(md_files, 1):
        print(f"Converting {i}/{len(md_files)}: {md_file}")
        
        if convert_file(md_file):
            successful += 1
            # Remove original markdown file after successful conversion
            try:
                os.remove(md_file)
                print(f"  ✓ Converted and removed: {md_file}")
            except Exception as e:
                print(f"  ⚠ Converted but failed to remove: {md_file} - {e}")
        else:
            failed += 1
            print(f"  ✗ Failed: {md_file}")
    
    print(f"\nConversion complete!")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Total: {len(md_files)}")

if __name__ == "__main__":
    main() 
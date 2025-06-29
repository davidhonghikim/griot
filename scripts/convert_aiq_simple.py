#!/usr/bin/env python3
import os
import yaml
import shutil
import re

def convert_md_to_yaml(md_path):
    """Convert a markdown file to YAML format."""
    try:
        # Read markdown file
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create backup
        backup_path = md_path + '.backup'
        shutil.copy2(md_path, backup_path)
        
        # Parse frontmatter and content
        frontmatter = {}
        body = content
        
        if content.startswith('---'):
            lines = content.split('\n')
            frontmatter_end = -1
            for i, line in enumerate(lines):
                if line.strip() == '---' and i > 0:
                    frontmatter_end = i
                    break
            
            if frontmatter_end > 0:
                frontmatter_content = '\n'.join(lines[1:frontmatter_end])
                try:
                    frontmatter = yaml.safe_load(frontmatter_content) or {}
                except:
                    frontmatter = {}
                body = '\n'.join(lines[frontmatter_end + 1:])
        
        # Create YAML structure
        yaml_data = {
            'metadata': {
                'original_file': os.path.basename(md_path),
                'conversion_date': '2025-06-30T11:00:00Z',
                'format': 'yaml'
            }
        }
        
        if frontmatter:
            yaml_data['frontmatter'] = frontmatter
        
        # Parse sections
        sections = []
        lines = body.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            header_match = re.match(r'^(#{1,6})\s+(.+)$', line)
            if header_match:
                if current_section:
                    current_section['content'] = '\n'.join(current_content).strip()
                    sections.append(current_section)
                
                level = len(header_match.group(1))
                title = header_match.group(2).strip()
                current_section = {
                    'level': level,
                    'title': title,
                    'type': 'section'
                }
                current_content = []
            else:
                current_content.append(line)
        
        if current_section:
            current_section['content'] = '\n'.join(current_content).strip()
            sections.append(current_section)
        
        if sections:
            yaml_data['sections'] = sections
        elif body.strip():
            yaml_data['content'] = body.strip()
        
        # Write YAML file
        yaml_path = md_path.replace('.md', '.yml')
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        
        # Verify YAML
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        
        return True, yaml_path
        
    except Exception as e:
        print(f"Error converting {md_path}: {e}")
        return False, None

def main():
    # Core directories to convert
    core_dirs = [
        "ai-q/01_foundation",
        "ai-q/02_protocols", 
        "ai-q/03_node_specifications",
        "ai-q/04_architecture",
        "ai-q/04_scenarios_and_workflows",
        "ai-q/05_modules",
        "ai-q/06_quality",
        "ai-q/07_development"
    ]
    
    # Core files to convert
    core_files = [
        "ai-q/00_KNOWLEDGE_LIBRARY_SYSTEM.md"
    ]
    
    # Get all markdown files
    md_files = []
    
    # Add core files
    for file_path in core_files:
        if os.path.exists(file_path):
            md_files.append(file_path)
    
    # Add files from core directories
    for dir_path in core_dirs:
        if os.path.exists(dir_path):
            for root, dirs, files in os.walk(dir_path):
                for file in files:
                    if file.endswith('.md'):
                        md_files.append(os.path.join(root, file))
    
    print(f"Found {len(md_files)} markdown files to convert")
    
    successful = 0
    failed = 0
    
    for i, md_file in enumerate(md_files, 1):
        print(f"[{i}/{len(md_files)}] Converting: {md_file}")
        
        success, yaml_path = convert_md_to_yaml(md_file)
        
        if success:
            successful += 1
            print(f"  ✓ Success: {yaml_path}")
        else:
            failed += 1
            print(f"  ✗ Failed: {md_file}")
    
    print(f"\nConversion complete!")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Total: {len(md_files)}")

if __name__ == "__main__":
    main() 
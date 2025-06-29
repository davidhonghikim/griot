#!/usr/bin/env python3
"""
Restore Markdown files from converted YAML files
"""

import os
import yaml
import glob
from pathlib import Path

def yaml_to_markdown(yaml_path: str) -> str:
    """Convert YAML structure back to markdown."""
    try:
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_data = yaml.safe_load(f)
        
        # Reconstruct markdown content
        markdown_content = ""
        
        # Add frontmatter if it exists
        if 'frontmatter' in yaml_data:
            markdown_content += "---\n"
            markdown_content += yaml.dump(yaml_data['frontmatter'], default_flow_style=False, allow_unicode=True)
            markdown_content += "---\n\n"
        
        # Reconstruct sections
        if 'sections' in yaml_data:
            for section in yaml_data['sections']:
                # Add header
                level = section.get('level', 1)
                title = section.get('title', '')
                markdown_content += f"{'#' * level} {title}\n\n"
                
                # Add content
                content = section.get('content', '')
                if content:
                    markdown_content += f"{content}\n\n"
        
        # Add general content if no sections
        elif 'content' in yaml_data:
            markdown_content += yaml_data['content']
        
        return markdown_content
        
    except Exception as e:
        print(f"Error converting {yaml_path}: {e}")
        return ""

def restore_file(yaml_path: str) -> bool:
    """Restore a single markdown file from YAML."""
    try:
        # Convert YAML back to markdown
        markdown_content = yaml_to_markdown(yaml_path)
        
        if not markdown_content:
            return False
        
        # Create markdown file path
        md_path = yaml_path.replace('.yml', '.md')
        
        # Write markdown file
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        
        # Remove YAML file
        os.remove(yaml_path)
        
        return True
    except Exception as e:
        print(f"Error restoring {yaml_path}: {e}")
        return False

def main():
    """Main restoration function."""
    aiq_dir = "ai-q"
    
    if not os.path.exists(aiq_dir):
        print(f"Directory {aiq_dir} not found!")
        return
    
    # Find all YAML files (excluding node_modules)
    yaml_files = []
    for root, dirs, files in os.walk(aiq_dir):
        # Skip node_modules directories
        if 'node_modules' in root:
            continue
        
        for file in files:
            if file.endswith('.yml'):
                yaml_files.append(os.path.join(root, file))
    
    print(f"Found {len(yaml_files)} YAML files to restore")
    
    # Restore files
    successful = 0
    failed = 0
    
    for i, yaml_file in enumerate(yaml_files, 1):
        print(f"Restoring {i}/{len(yaml_files)}: {yaml_file}")
        
        if restore_file(yaml_file):
            successful += 1
            print(f"  ✓ Restored: {yaml_file}")
        else:
            failed += 1
            print(f"  ✗ Failed: {yaml_file}")
    
    print(f"\nRestoration complete!")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Total: {len(yaml_files)}")

if __name__ == "__main__":
    main() 
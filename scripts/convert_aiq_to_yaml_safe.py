#!/usr/bin/env python3
"""
Safe Markdown to YAML Converter for ai-q Directory
Converts all .md files in the ai-q directory tree to YAML format with backup and verification
"""

import os
import re
import yaml
import shutil
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime

def calculate_file_hash(filepath: str) -> str:
    """Calculate SHA256 hash of a file."""
    hash_sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()

def create_backup_directory() -> str:
    """Create a backup directory with timestamp."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = f"ai-q_backup_{timestamp}"
    os.makedirs(backup_dir, exist_ok=True)
    return backup_dir

def backup_file(original_path: str, backup_dir: str) -> str:
    """Create a backup of the original file."""
    relative_path = os.path.relpath(original_path, "ai-q")
    backup_path = os.path.join(backup_dir, relative_path)
    
    # Create directory structure in backup
    os.makedirs(os.path.dirname(backup_path), exist_ok=True)
    
    # Copy file to backup
    shutil.copy2(original_path, backup_path)
    return backup_path

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
            'conversion_date': datetime.now().isoformat(),
            'format': 'yaml',
            'original_content_length': len(content),
            'original_content_hash': hashlib.sha256(content.encode('utf-8')).hexdigest()
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

def verify_conversion(original_content: str, yaml_data: Dict[str, Any]) -> bool:
    """Verify that the YAML conversion preserves all original content."""
    # Reconstruct original content from YAML
    reconstructed = ""
    
    # Add frontmatter if it existed
    if 'frontmatter' in yaml_data:
        reconstructed += "---\n"
        reconstructed += yaml.dump(yaml_data['frontmatter'], default_flow_style=False, allow_unicode=True)
        reconstructed += "---\n\n"
    
    # Reconstruct sections
    if 'sections' in yaml_data:
        for section in yaml_data['sections']:
            level = section['level']
            title = section['title']
            content = section.get('content', '')
            
            # Add header
            reconstructed += '#' * level + ' ' + title + '\n\n'
            
            # Add content
            if content:
                reconstructed += content + '\n\n'
    elif 'content' in yaml_data:
        reconstructed += yaml_data['content']
    
    # Normalize whitespace for comparison
    original_normalized = re.sub(r'\s+', ' ', original_content.strip())
    reconstructed_normalized = re.sub(r'\s+', ' ', reconstructed.strip())
    
    return original_normalized == reconstructed_normalized

def convert_file_safe(md_path: str, backup_dir: str) -> tuple[bool, str]:
    """Convert a single markdown file to YAML with safety checks."""
    try:
        # Read original file
        with open(md_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Calculate original hash
        original_hash = hashlib.sha256(original_content.encode('utf-8')).hexdigest()
        
        # Create backup
        backup_path = backup_file(md_path, backup_dir)
        
        # Convert to YAML structure
        yaml_data = markdown_to_yaml_structure(original_content, os.path.basename(md_path))
        
        # Create YAML file path
        yaml_path = md_path.replace('.md', '.yml')
        
        # Write YAML file
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        
        # Verify YAML is valid
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        
        # Verify conversion preserves content
        if not verify_conversion(original_content, yaml_data):
            raise Exception("Content verification failed - data loss detected")
        
        # Verify backup integrity
        with open(backup_path, 'r', encoding='utf-8') as f:
            backup_content = f.read()
        backup_hash = hashlib.sha256(backup_content.encode('utf-8')).hexdigest()
        
        if backup_hash != original_hash:
            raise Exception("Backup verification failed - backup corrupted")
        
        return True, f"✓ Converted and verified: {md_path}"
        
    except Exception as e:
        return False, f"✗ Failed: {md_path} - {e}"

def main():
    """Main conversion function with safety measures."""
    aiq_dir = "ai-q"
    
    if not os.path.exists(aiq_dir):
        print(f"Directory {aiq_dir} not found!")
        return
    
    # Create backup directory
    backup_dir = create_backup_directory()
    print(f"Created backup directory: {backup_dir}")
    
    # Find all markdown files (excluding node_modules)
    md_files = []
    for root, dirs, files in os.walk(aiq_dir):
        # Skip node_modules directories
        dirs[:] = [d for d in dirs if d != 'node_modules']
        
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    
    print(f"Found {len(md_files)} markdown files to convert")
    print(f"Backup location: {backup_dir}")
    print("Starting conversion with full backup and verification...")
    
    # Convert files
    successful = 0
    failed = 0
    failed_files = []
    
    for i, md_file in enumerate(md_files, 1):
        print(f"Converting {i}/{len(md_files)}: {md_file}")
        
        success, message = convert_file_safe(md_file, backup_dir)
        
        if success:
            successful += 1
            print(f"  {message}")
            
            # Only remove original after successful conversion and verification
            try:
                os.remove(md_file)
                print(f"  ✓ Removed original: {md_file}")
            except Exception as e:
                print(f"  ⚠ Failed to remove original: {md_file} - {e}")
        else:
            failed += 1
            failed_files.append(md_file)
            print(f"  {message}")
    
    # Create conversion report
    report_path = f"conversion_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(report_path, 'w') as f:
        f.write(f"AI-Q Markdown to YAML Conversion Report\n")
        f.write(f"Date: {datetime.now().isoformat()}\n")
        f.write(f"Backup Directory: {backup_dir}\n")
        f.write(f"Total Files: {len(md_files)}\n")
        f.write(f"Successful: {successful}\n")
        f.write(f"Failed: {failed}\n")
        f.write(f"Success Rate: {(successful/len(md_files)*100):.1f}%\n\n")
        
        if failed_files:
            f.write("Failed Files:\n")
            for failed_file in failed_files:
                f.write(f"  - {failed_file}\n")
    
    print(f"\nConversion complete!")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Total: {len(md_files)}")
    print(f"Success Rate: {(successful/len(md_files)*100):.1f}%")
    print(f"Backup location: {backup_dir}")
    print(f"Report: {report_path}")
    
    if failed > 0:
        print(f"\n⚠️  {failed} files failed conversion. Check the report for details.")
        print("Original files are preserved in the backup directory.")

if __name__ == "__main__":
    main() 
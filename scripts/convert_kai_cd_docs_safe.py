#!/usr/bin/env python3
"""
Safe Markdown to YAML Converter for kai-cd/documentation
- Backs up each .md file
- Converts to .yml
- Validates YAML
- Compares original and round-tripped content
"""
import os
import yaml
import shutil
import re
from pathlib import Path

def extract_frontmatter(content):
    if not content.startswith('---'):
        return None, content
    lines = content.split('\n')
    if len(lines) < 2:
        return None, content
    frontmatter_lines = []
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
    if frontmatter_end == -1:
        return None, content
    try:
        frontmatter_content = '\n'.join(frontmatter_lines[1:])
        frontmatter = yaml.safe_load(frontmatter_content) if frontmatter_content.strip() else {}
    except yaml.YAMLError:
        frontmatter = {}
    body = '\n'.join(lines[frontmatter_end + 1:])
    return frontmatter, body

def markdown_to_yaml_structure(content, filename):
    frontmatter, body = extract_frontmatter(content)
    yaml_data = {
        'metadata': {
            'original_file': filename,
            'conversion_date': '2025-06-30T11:00:00Z',
            'format': 'yaml'
        }
    }
    if frontmatter:
        yaml_data['frontmatter'] = frontmatter
    lines = body.split('\n')
    sections = []
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
    return yaml_data

def yaml_to_markdown(yaml_path):
    try:
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml_data = yaml.safe_load(f)
        markdown_content = ""
        if 'frontmatter' in yaml_data:
            markdown_content += "---\n"
            markdown_content += yaml.dump(yaml_data['frontmatter'], default_flow_style=False, allow_unicode=True)
            markdown_content += "---\n\n"
        if 'sections' in yaml_data:
            for section in yaml_data['sections']:
                level = section.get('level', 1)
                title = section.get('title', '')
                markdown_content += f"{'#' * level} {title}\n\n"
                content = section.get('content', '')
                if content:
                    markdown_content += f"{content}\n\n"
        elif 'content' in yaml_data:
            markdown_content += yaml_data['content']
        return markdown_content
    except Exception as e:
        print(f"Error converting {yaml_path} back to markdown: {e}")
        return ""

def compare_contents(original, roundtrip):
    # Normalize whitespace for comparison
    o = '\n'.join([l.rstrip() for l in original.strip().split('\n') if l.strip()])
    r = '\n'.join([l.rstrip() for l in roundtrip.strip().split('\n') if l.strip()])
    return o == r

def convert_file_safe(md_path):
    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
        backup_path = md_path + '.backup'
        shutil.copy2(md_path, backup_path)
        yaml_data = markdown_to_yaml_structure(original_content, os.path.basename(md_path))
        yaml_path = md_path.replace('.md', '.yml')
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(yaml_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
        with open(yaml_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        # Round-trip check
        roundtrip_md = yaml_to_markdown(yaml_path)
        if not compare_contents(original_content, roundtrip_md):
            print(f"✗ CONTENT MISMATCH: {md_path}")
            with open(md_path + '.diff', 'w', encoding='utf-8') as diff:
                diff.write('--- ORIGINAL ---\n')
                diff.write(original_content)
                diff.write('\n--- ROUNDTRIP ---\n')
                diff.write(roundtrip_md)
            return False, yaml_path
        return True, yaml_path
    except Exception as e:
        print(f"Error converting {md_path}: {e}")
        return False, None

def main():
    doc_dir = '../kai-cd/documentation'
    md_files = []
    for root, dirs, files in os.walk(doc_dir):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    print(f"Found {len(md_files)} markdown files to convert")
    successful = 0
    failed = 0
    for i, md_file in enumerate(md_files, 1):
        print(f"[{i}/{len(md_files)}] Converting: {md_file}")
        success, yaml_path = convert_file_safe(md_file)
        if success:
            successful += 1
            print(f"  ✓ Success: {yaml_path}")
        else:
            failed += 1
            print(f"  ✗ Failed or mismatch: {md_file}")
    print(f"\nConversion complete!")
    print(f"Successful: {successful}")
    print(f"Failed or mismatched: {failed}")
    print(f"Total: {len(md_files)}")
    print("If any .diff files were created, please review them for manual reconciliation.")

if __name__ == "__main__":
    main() 
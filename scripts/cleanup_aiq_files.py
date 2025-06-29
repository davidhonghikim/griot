#!/usr/bin/env python3
"""
Cleanup script for ai-q directory after successful YAML conversion
Removes original .md files and .backup files
"""

import os
import glob

def cleanup_files():
    """Clean up original markdown files and backup files."""
    
    # Find all markdown files (excluding node_modules)
    md_files = []
    for root, dirs, files in os.walk("ai-q"):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    
    # Find all backup files
    backup_files = []
    for root, dirs, files in os.walk("ai-q"):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.backup'):
                backup_files.append(os.path.join(root, file))
    
    print(f"Found {len(md_files)} markdown files to remove")
    print(f"Found {len(backup_files)} backup files to remove")
    print()
    
    # Remove markdown files
    md_removed = 0
    for md_file in md_files:
        try:
            os.remove(md_file)
            md_removed += 1
            print(f"✓ Removed: {md_file}")
        except Exception as e:
            print(f"✗ Failed to remove {md_file}: {e}")
    
    print()
    
    # Remove backup files
    backup_removed = 0
    for backup_file in backup_files:
        try:
            os.remove(backup_file)
            backup_removed += 1
            print(f"✓ Removed: {backup_file}")
        except Exception as e:
            print(f"✗ Failed to remove {backup_file}: {e}")
    
    print()
    print("=" * 60)
    print(f"Cleanup complete!")
    print(f"Markdown files removed: {md_removed}")
    print(f"Backup files removed: {backup_removed}")
    print(f"Total files cleaned: {md_removed + backup_removed}")

if __name__ == "__main__":
    cleanup_files() 
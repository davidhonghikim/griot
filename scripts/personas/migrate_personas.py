#!/usr/bin/env python3
"""
Migration script to convert existing persona files to new sharded structure.
Converts: packages/data/personas/{class}/persona.yml
To: packages/data/personas/{class}/{class}-core-dangermouse-{uuid7}.yml
"""

import os
import yaml
import uuid
import shutil
from datetime import datetime
from pathlib import Path

def generate_uuid7():
    """Generate a UUIDv7-like timestamp-based UUID."""
    # For now, use UUIDv4 but in the future we can implement proper UUIDv7
    return str(uuid.uuid4())

def migrate_persona_file(old_path, new_path, class_name):
    """Migrate a single persona file to new format."""
    
    # Read the old file
    with open(old_path, 'r') as f:
        content = f.read()
    
    # Parse YAML to add metadata
    try:
        data = yaml.safe_load(content)
    except yaml.YAMLError:
        print(f"Warning: Could not parse YAML in {old_path}")
        return False
    
    # Generate new metadata
    uuid7 = generate_uuid7()
    now = datetime.utcnow().isoformat() + 'Z'
    
    # Create new metadata block
    metadata = {
        'id': f"{class_name}-core-dangermouse-{uuid7}",
        'uuid': uuid7,
        'type': 'persona',
        'base': class_name,
        'variant': 'core',
        'author': 'dangermouse',
        'created': now,
        'updated': now,
        'description': data.get('description', f'Core {class_name} persona'),
        'tags': data.get('tags', ['core', 'essential']),
        'rank': 4.8,
        'downloads': 0
    }
    
    # Merge metadata with existing data
    new_data = {**metadata, **data}
    
    # Write new file
    with open(new_path, 'w') as f:
        yaml.dump(new_data, f, default_flow_style=False, sort_keys=False)
    
    print(f"Migrated: {old_path} -> {new_path}")
    return True

def main():
    """Main migration function."""
    base_path = Path("packages/data/personas")
    
    # Find all existing persona files
    persona_files = list(base_path.rglob("persona.yml"))
    
    print(f"Found {len(persona_files)} persona files to migrate")
    
    for persona_file in persona_files:
        # Extract class name from directory
        class_name = persona_file.parent.name
        
        # Skip if it's already in the new format
        if class_name in ['griot', 'musa', 'tohunga', 'ronin', 'hakim', 'skald', 
                         'oracle', 'junzi', 'yachay', 'sachem', 'archon', 'amauta', 'mzee']:
            
            # Generate new filename
            uuid7 = generate_uuid7()
            new_filename = f"{class_name}-core-dangermouse-{uuid7}.yml"
            new_path = persona_file.parent / new_filename
            
            # Migrate the file
            if migrate_persona_file(persona_file, new_path, class_name):
                # Remove old file
                persona_file.unlink()
                print(f"Removed old file: {persona_file}")
    
    print("Migration completed!")

if __name__ == "__main__":
    main() 
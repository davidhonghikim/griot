#!/usr/bin/env python3
"""
Persona-Driven Asset Loader for kOS
Loads assets based on persona configuration and preferences
Works with sharded directory structure and UUIDv7 naming
"""

import json
import yaml
import logging
import glob
from pathlib import Path
from typing import Dict, List, Any, Optional, Set
from datetime import datetime

logger = logging.getLogger(__name__)

class PersonaLoaderV2:
    def __init__(self, project_root: str = "packages/data"):
        self.project_root = Path(project_root)
        self.personas_path = self.project_root / "personas"
        self.skills_path = self.project_root / "skills"
        self.recipes_path = self.project_root / "recipes"
        
        # File size limits (in bytes) for optimal token usage
        self.size_limits = {
            "persona_files": 50 * 1024,  # 50KB
            "skill_files": 100 * 1024,   # 100KB
            "recipe_files": 200 * 1024,  # 200KB
            "config_files": 1024 * 1024, # 1MB
            "agent_context": 100 * 1024  # 100KB
        }
        
        # Cache for loaded personas and assets
        self.persona_cache = {}
        self.asset_cache = {}
        
    def find_persona_by_id(self, persona_id: str) -> Optional[Path]:
        """Find persona file by ID (supports partial matching)"""
        # Search in all persona subdirectories
        for class_dir in self.personas_path.iterdir():
            if class_dir.is_dir():
                # Look for files matching the persona_id pattern
                pattern = f"{persona_id}*.yml"
                matches = list(class_dir.glob(pattern))
                if matches:
                    return matches[0]
        return None
    
    def find_persona_by_base(self, base_name: str) -> Optional[Path]:
        """Find persona file by base class name"""
        base_dir = self.personas_path / base_name
        if base_dir.exists():
            # Find the first .yml file in the directory
            yml_files = list(base_dir.glob("*.yml"))
            if yml_files:
                return yml_files[0]  # Return the first one found
        return None
    
    def load_persona_config(self, persona_identifier: str) -> Optional[Dict[str, Any]]:
        """Load persona configuration file by ID or base name"""
        
        # Try to find the persona file
        persona_file = self.find_persona_by_id(persona_identifier)
        if not persona_file:
            persona_file = self.find_persona_by_base(persona_identifier)
        
        if not persona_file or not persona_file.exists():
            logger.warning(f"Persona not found: {persona_identifier}")
            return None
        
        try:
            with open(persona_file, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            
            # Validate file size
            file_size = persona_file.stat().st_size
            if file_size > self.size_limits["persona_files"]:
                logger.warning(f"Persona config file {persona_file} exceeds size limit: {file_size} bytes")
            
            # Add metadata
            config['_metadata'] = {
                'config_file': str(persona_file),
                'file_size': file_size,
                'loaded_at': datetime.now().isoformat()
            }
            
            logger.info(f"✅ Loaded persona config: {persona_identifier} from {persona_file}")
            return config
            
        except Exception as e:
            logger.error(f"Failed to load persona config {persona_file}: {e}")
            return None
    
    def get_persona_asset_preferences(self, persona_config: Dict[str, Any]) -> Dict[str, Any]:
        """Extract asset loading preferences from persona config"""
        preferences = {
            'asset_types': [],
            'categories': [],
            'tags': [],
            'priority_files': [],
            'exclude_patterns': [],
            'max_context_size': self.size_limits["agent_context"]
        }
        
        # Extract from asset_preferences section
        if 'asset_preferences' in persona_config:
            prefs = persona_config['asset_preferences']
            preferences['asset_types'].extend(prefs.get('types', []))
            preferences['categories'].extend(prefs.get('categories', []))
            preferences['tags'].extend(prefs.get('tags', []))
            preferences['priority_files'].extend(prefs.get('priority_files', []))
            preferences['exclude_patterns'].extend(prefs.get('exclude_patterns', []))
            
            if 'max_context_size' in prefs:
                preferences['max_context_size'] = prefs['max_context_size']
        
        # Extract from skills section if present
        if 'skills' in persona_config:
            preferences['asset_types'].append('skills')
            for skill in persona_config['skills']:
                if isinstance(skill, str):
                    preferences['tags'].append(skill)
        
        # Extract from tags if present
        if 'tags' in persona_config:
            tags = persona_config['tags']
            if isinstance(tags, list):
                preferences['tags'].extend(tags)
        
        # Remove duplicates
        preferences['asset_types'] = list(set(preferences['asset_types']))
        preferences['categories'] = list(set(preferences['categories']))
        preferences['tags'] = list(set(preferences['tags']))
        
        return preferences
    
    def load_assets_for_persona(self, persona_identifier: str) -> Dict[str, Any]:
        """Load assets based on persona preferences"""
        # Load persona config
        persona_config = self.load_persona_config(persona_identifier)
        if not persona_config:
            return {}
        
        # Get asset preferences
        preferences = self.get_persona_asset_preferences(persona_config)
        
        # Load assets based on preferences
        loaded_assets = {
            'persona': persona_config,
            'preferences': preferences,
            'assets': {},
            'total_size': 0,
            'chunks_loaded': 0
        }
        
        # Load by asset types
        for asset_type in preferences['asset_types']:
            if asset_type not in loaded_assets['assets']:
                loaded_assets['assets'][asset_type] = []
            
            # Get all assets of this type from sharded directories
            type_assets = self.load_assets_by_type(asset_type, preferences)
            loaded_assets['assets'][asset_type].extend(type_assets)
        
        # Calculate total size and chunks
        for asset_type, assets in loaded_assets['assets'].items():
            for asset in assets:
                loaded_assets['total_size'] += asset.get('size', 0)
                loaded_assets['chunks_loaded'] += 1
        
        # Check context size limit
        if loaded_assets['total_size'] > preferences['max_context_size']:
            logger.warning(f"Persona {persona_identifier} assets exceed context size limit: {loaded_assets['total_size']} bytes")
        
        logger.info(f"📦 Loaded {loaded_assets['chunks_loaded']} assets for persona {persona_identifier} ({loaded_assets['total_size']} bytes)")
        
        return loaded_assets
    
    def load_assets_by_type(self, asset_type: str, preferences: Dict[str, Any]) -> List[Dict]:
        """Load assets of a specific type from sharded directories"""
        assets = []
        
        # Determine the base path for this asset type
        if asset_type == 'skills':
            base_path = self.skills_path
        elif asset_type == 'recipes':
            base_path = self.recipes_path
        else:
            logger.warning(f"Unknown asset type: {asset_type}")
            return assets
        
        if not base_path.exists():
            logger.warning(f"Asset type directory not found: {base_path}")
            return assets
        
        # Load from all subdirectories (sharded)
        for category_dir in base_path.iterdir():
            if category_dir.is_dir():
                # Load all .yml files in this category
                for asset_file in category_dir.glob("*.yml"):
                    try:
                        with open(asset_file, 'r', encoding='utf-8') as f:
                            asset_data = yaml.safe_load(f)
                        
                        # Add file metadata
                        asset_data['_metadata'] = {
                            'file_path': str(asset_file),
                            'file_size': asset_file.stat().st_size,
                            'asset_type': asset_type,
                            'category': category_dir.name
                        }
                        
                        # Filter by preferences
                        if self.matches_preferences(asset_data, preferences):
                            assets.append(asset_data)
                            
                    except Exception as e:
                        logger.error(f"Failed to load asset {asset_file}: {e}")
        
        return assets
    
    def matches_preferences(self, asset_data: Dict, preferences: Dict[str, Any]) -> bool:
        """Check if an asset matches the persona preferences"""
        # Check categories
        if preferences['categories']:
            asset_category = asset_data.get('_metadata', {}).get('category', '')
            if asset_category not in preferences['categories']:
                return False
        
        # Check tags
        if preferences['tags']:
            asset_tags = asset_data.get('tags', [])
            if not any(tag in asset_tags for tag in preferences['tags']):
                return False
        
        # Check exclude patterns
        if preferences['exclude_patterns']:
            asset_name = asset_data.get('name', '')
            asset_description = asset_data.get('description', '')
            for pattern in preferences['exclude_patterns']:
                if pattern.lower() in asset_name.lower() or pattern.lower() in asset_description.lower():
                    return False
        
        return True
    
    def list_all_personas(self) -> List[Dict[str, Any]]:
        """List all available personas with their metadata"""
        personas = []
        
        for class_dir in self.personas_path.iterdir():
            if class_dir.is_dir():
                for persona_file in class_dir.glob("*.yml"):
                    try:
                        with open(persona_file, 'r', encoding='utf-8') as f:
                            config = yaml.safe_load(f)
                        
                        personas.append({
                            'id': config.get('id', ''),
                            'name': config.get('name', ''),
                            'base': config.get('base', ''),
                            'variant': config.get('variant', ''),
                            'author': config.get('author', ''),
                            'description': config.get('description', ''),
                            'tags': config.get('tags', []),
                            'file_path': str(persona_file)
                        })
                        
                    except Exception as e:
                        logger.error(f"Failed to load persona metadata {persona_file}: {e}")
        
        return personas
    
    def get_persona_summary(self, persona_identifier: str) -> Dict[str, Any]:
        """Get a summary of a persona and its loaded assets"""
        loaded_assets = self.load_assets_for_persona(persona_identifier)
        
        if not loaded_assets:
            return {}
        
        summary = {
            'persona_id': loaded_assets['persona'].get('id', ''),
            'persona_name': loaded_assets['persona'].get('name', ''),
            'base': loaded_assets['persona'].get('base', ''),
            'variant': loaded_assets['persona'].get('variant', ''),
            'author': loaded_assets['persona'].get('author', ''),
            'description': loaded_assets['persona'].get('description', ''),
            'tags': loaded_assets['persona'].get('tags', []),
            'total_assets': loaded_assets['chunks_loaded'],
            'total_size': loaded_assets['total_size'],
            'asset_types': list(loaded_assets['assets'].keys()),
            'preferences': loaded_assets['preferences']
        }
        
        return summary

def main():
    """CLI interface for the persona loader"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Persona-Driven Asset Loader v2")
    parser.add_argument("--persona", required=True, help="Persona ID or base name")
    parser.add_argument("--list", action="store_true", help="List all available personas")
    parser.add_argument("--summary", action="store_true", help="Show persona summary")
    parser.add_argument("--load", action="store_true", help="Load persona assets")
    
    args = parser.parse_args()
    
    loader = PersonaLoaderV2()
    
    if args.list:
        personas = loader.list_all_personas()
        print(f"Found {len(personas)} personas:")
        for persona in personas:
            print(f"  {persona['id']} - {persona['name']} ({persona['author']})")
    
    elif args.summary:
        summary = loader.get_persona_summary(args.persona)
        if summary:
            print(f"Persona Summary: {summary['persona_name']}")
            print(f"  ID: {summary['persona_id']}")
            print(f"  Base: {summary['base']}")
            print(f"  Variant: {summary['variant']}")
            print(f"  Author: {summary['author']}")
            print(f"  Assets: {summary['total_assets']} files, {summary['total_size']} bytes")
            print(f"  Asset Types: {', '.join(summary['asset_types'])}")
        else:
            print(f"Persona not found: {args.persona}")
    
    elif args.load:
        loaded_assets = loader.load_assets_for_persona(args.persona)
        if loaded_assets:
            print(f"Loaded {loaded_assets['chunks_loaded']} assets for {args.persona}")
            print(f"Total size: {loaded_assets['total_size']} bytes")
        else:
            print(f"Failed to load persona: {args.persona}")

if __name__ == "__main__":
    main() 
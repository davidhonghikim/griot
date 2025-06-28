import json
import os
import yaml
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
import hashlib
import re

logger = logging.getLogger(__name__)

class AssetIndexer:
    def __init__(self, project_root: str = "packages/data"):
        self.project_root = Path(project_root)
        self.indexes_path = self.project_root / "indexes"
        self.indexes_path.mkdir(parents=True, exist_ok=True)
        
        # Asset type configurations
        self.asset_configs = {
            "skills": {
                "path": "skills",
                "extensions": [".yaml", ".yml", ".ts", ".js", ".py"],
                "chunk_by": "category",
                "max_chunk_size": 50,
                "priority_files": ["token_calculator_rag.yaml", "budget_manager.yaml"]
            },
            "recipes": {
                "path": "recipes",
                "extensions": [".yaml", ".yml", ".json"],
                "chunk_by": "category",
                "max_chunk_size": 30,
                "priority_files": ["budget_aware_chat.yaml", "media_processing_budget.yaml"]
            },
            "scripts": {
                "path": "scripts",
                "extensions": [".py", ".sh", ".js", ".ts"],
                "chunk_by": "category",
                "max_chunk_size": 20,
                "priority_files": ["setup_pricing_rag.py", "update_pricing.sh"]
            },
            "configs": {
                "path": "config",
                "extensions": [".json", ".yaml", ".yml"],
                "chunk_by": "type",
                "max_chunk_size": 25,
                "priority_files": ["default_pricing.json", "provider_config.json"]
            },
            "personas": {
                "path": "personas",
                "extensions": [".yaml", ".yml", ".json"],
                "chunk_by": "type",
                "max_chunk_size": 20,
                "priority_files": ["default_persona.yaml"]
            }
        }

    def extract_file_metadata(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Extract metadata from a file"""
        try:
            # Get basic file info
            stat = file_path.stat()
            relative_path = file_path.relative_to(self.project_root)
            
            # Determine file type and category
            file_type = self.determine_file_type(file_path)
            category = self.determine_category(file_path)
            
            # Extract content-based metadata
            content_metadata = self.extract_content_metadata(file_path)
            
            # Calculate file hash for change detection
            file_hash = self.calculate_file_hash(file_path)
            
            # Calculate size in KB (rounded, min 1KB if >0)
            size_kb = max(1, round(stat.st_size / 1024)) if stat.st_size > 0 else 0
            
            metadata = {
                "name": self.extract_name_from_file(file_path),
                "path": str(relative_path),
                "type": file_type,
                "category": category,
                "size": size_kb,
                "lastModified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "hash": file_hash,
                **content_metadata
            }
            
            return metadata
            
        except Exception as e:
            logger.warning(f"Failed to extract metadata from {file_path}: {e}")
            return None

    def determine_file_type(self, file_path: Path) -> str:
        """Determine the asset type based on file path"""
        for asset_type, config in self.asset_configs.items():
            if asset_type in str(file_path):
                return asset_type
        return "unknown"

    def determine_category(self, file_path: Path) -> str:
        """Determine the category based on file path and content"""
        # For personas, use the directory name as category
        if "personas" in str(file_path):
            return file_path.parent.name
        
        # For other types, try to extract from path
        path_parts = file_path.parts
        for i, part in enumerate(path_parts):
            if part in self.asset_configs:
                if i + 1 < len(path_parts):
                    return path_parts[i + 1]
                break
        
        return "general"

    def extract_content_metadata(self, file_path: Path) -> Dict[str, Any]:
        """Extract metadata from file content"""
        metadata = {}
        
        try:
            if file_path.suffix in ['.yaml', '.yml']:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = yaml.safe_load(f)
                    if content:
                        metadata.update(self.extract_yaml_metadata(content))
            elif file_path.suffix == '.json':
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = json.load(f)
                    if content:
                        metadata.update(self.extract_json_metadata(content))
            elif file_path.suffix in ['.py', '.js', '.ts']:
                metadata.update(self.extract_code_metadata(file_path))
        except Exception as e:
            logger.debug(f"Failed to extract content metadata from {file_path}: {e}")
        
        return metadata

    def extract_yaml_metadata(self, content: Dict) -> Dict[str, Any]:
        """Extract metadata from YAML content"""
        metadata = {}
        
        # Extract common fields
        if isinstance(content, dict):
            metadata['description'] = content.get('description', '')
            metadata['tags'] = content.get('tags', [])
            metadata['version'] = content.get('version', '')
            metadata['category'] = content.get('category', '')
            
            # For personas, extract specific fields
            if 'identity' in content:
                metadata['role'] = content['identity'].get('role', '')
                metadata['specialization'] = content['identity'].get('specialization', '')
            
            if 'skills' in content:
                metadata['skill_count'] = len(content['skills'])
        
        return metadata

    def extract_json_metadata(self, content: Dict) -> Dict[str, Any]:
        """Extract metadata from JSON content"""
        metadata = {}
        
        if isinstance(content, dict):
            metadata['description'] = content.get('description', '')
            metadata['tags'] = content.get('tags', [])
            metadata['version'] = content.get('version', '')
        
        return metadata

    def extract_code_metadata(self, file_path: Path) -> Dict[str, Any]:
        """Extract metadata from code files"""
        metadata = {}
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            # Extract docstring or comments
            description_lines = []
            for line in lines[:20]:  # Check first 20 lines
                line = line.strip()
                if line.startswith('#') or line.startswith('"""') or line.startswith("'''"):
                    description_lines.append(line.lstrip('#').strip().strip('"').strip("'"))
            
            if description_lines:
                metadata['description'] = ' '.join(description_lines[:3])  # First 3 lines
        
        except Exception as e:
            logger.debug(f"Failed to extract code metadata from {file_path}: {e}")
        
        return metadata

    def calculate_file_hash(self, file_path: Path) -> str:
        """Calculate SHA256 hash of file content"""
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
                return hashlib.sha256(content).hexdigest()
        except Exception as e:
            logger.warning(f"Failed to calculate hash for {file_path}: {e}")
            return ""

    def extract_name_from_file(self, file_path: Path) -> str:
        """Extract a human-readable name from the file"""
        # Remove extension and convert to title case
        name = file_path.stem
        name = re.sub(r'[_-]', ' ', name)
        return name.title()

    def index_asset_type(self, asset_type: str, config: Dict, indexes_path: Path, force_update: bool = False) -> bool:
        """Index a specific asset type"""
        asset_path = self.project_root / config["path"]
        
        if not asset_path.exists():
            logger.warning(f"Asset path not found: {asset_path}")
            return False
        
        # Create type-specific index directory
        type_index_path = indexes_path / asset_type
        type_index_path.mkdir(exist_ok=True)
        
        # Find all relevant files
        files = []
        for ext in config["extensions"]:
            files.extend(asset_path.rglob(f"*{ext}"))
        
        if not files:
            logger.info(f"No files found for {asset_type}")
            return False
        
        # Extract metadata for all files
        file_metadata = []
        for file_path in files:
            metadata = self.extract_file_metadata(file_path)
            if metadata:
                file_metadata.append(metadata)
        
        # Group files by category
        categories = {}
        for metadata in file_metadata:
            category = metadata.get('category', 'general')
            if category not in categories:
                categories[category] = []
            categories[category].append(metadata)
        
        # Create chunked indexes
        for category, files in categories.items():
            chunk_name = category.lower().replace(' ', '_')
            chunk_path = type_index_path / f"{chunk_name}.json"
            
            chunk_data = {
                "category": category,
                "asset_type": asset_type,
                "total_files": len(files),
                "last_updated": datetime.now().isoformat(),
                "files": files
            }
            
            # Write chunk file
            with open(chunk_path, 'w') as f:
                json.dump(chunk_data, f, indent=2)
            
            logger.info(f"📦 Created chunk: {asset_type}/{chunk_name} ({len(files)} files)")
        
        return True

    def index_all(self, force_update: bool = False) -> bool:
        """Index all asset types"""
        logger.info("🚀 Starting asset indexing...")
        
        total_assets = 0
        successful_types = []
        
        for asset_type, config in self.asset_configs.items():
            logger.info(f"📁 Indexing {asset_type}...")
            
            if self.index_asset_type(asset_type, config, self.indexes_path, force_update):
                # Count total files for this type
                type_index_path = self.indexes_path / asset_type
                if type_index_path.exists():
                    chunk_files = list(type_index_path.glob("*.json"))
                    type_total = 0
                    for chunk_file in chunk_files:
                        with open(chunk_file, 'r') as f:
                            chunk_data = json.load(f)
                            type_total += chunk_data.get('total_files', 0)
                    total_assets += type_total
                    successful_types.append(asset_type)
                    logger.info(f"✅ {asset_type}: {type_total} files indexed")
        
        # Create/update bootstrap index
        self.create_bootstrap_index(total_assets, successful_types)
        
        logger.info(f"🎉 Indexing complete! {total_assets} total assets across {len(successful_types)} types")
        return True

    def create_bootstrap_index(self, total_assets: int, successful_types: List[str]) -> None:
        """Create or update the bootstrap index"""
        bootstrap_data = {
            "version": "1.0.0",
            "lastUpdated": datetime.now().isoformat(),
            "description": "Essential bootstrap index for agent initialization",
            "system": {
                "projectRoot": str(self.project_root),
                "indexesPath": str(self.indexes_path),
                "totalAssets": total_assets,
                "lastIndexUpdate": datetime.now().isoformat()
            },
            "critical": {
                "coreSkills": [],
                "coreRecipes": [],
                "coreScripts": [],
                "coreConfigs": [],
                "corePersonas": []
            },
            "indexes": {}
        }
        
        # Add index information for each successful type
        for asset_type in successful_types:
            type_index_path = self.indexes_path / asset_type
            if type_index_path.exists():
                chunk_files = list(type_index_path.glob("*.json"))
                chunks = [f.stem for f in chunk_files]
                type_total = 0
                
                # Count total files for this type
                for chunk_file in chunk_files:
                    try:
                        with open(chunk_file, 'r') as f:
                            chunk_data = json.load(f)
                            type_total += chunk_data.get('total_files', 0)
                    except Exception as e:
                        logger.warning(f"Failed to read chunk file {chunk_file}: {e}")
                
                bootstrap_data["indexes"][asset_type] = {
                    "chunks": chunks,
                    "totalFiles": type_total
                }
        
        # Add critical assets (priority files)
        for asset_type, config in self.asset_configs.items():
            if asset_type in successful_types:
                critical_key = f"core{asset_type.capitalize()}"
                critical_assets = []
                
                for priority_file in config.get("priority_files", []):
                    # Find the priority file
                    type_index_path = self.indexes_path / asset_type
                    if type_index_path.exists():
                        for chunk_file in type_index_path.glob("*.json"):
                            try:
                                with open(chunk_file, 'r') as f:
                                    chunk_data = json.load(f)
                                    for file_data in chunk_data.get("files", []):
                                        if priority_file in file_data.get("name", ""):
                                            critical_assets.append(file_data)
                                            break
                            except Exception as e:
                                logger.warning(f"Failed to read chunk file {chunk_file}: {e}")
                
                bootstrap_data["critical"][critical_key] = critical_assets
        
        # Write bootstrap index
        bootstrap_path = self.indexes_path / "bootstrap.json"
        with open(bootstrap_path, 'w') as f:
            json.dump(bootstrap_data, f, indent=2)
        
        logger.info(f"📋 Bootstrap index created: {total_assets} assets")

def main():
    """Main function for command line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Asset Indexer for kOS")
    parser.add_argument("--force", action="store_true", help="Force update all indexes")
    parser.add_argument("--types", nargs="+", help="Specific asset types to index")
    parser.add_argument("--project-root", type=str, default="packages/data", help="Project root path")
    
    args = parser.parse_args()
    
    indexer = AssetIndexer(args.project_root)
    
    if args.types:
        # Index specific types
        for asset_type in args.types:
            if asset_type in indexer.asset_configs:
                config = indexer.asset_configs[asset_type]
                indexer.index_asset_type(asset_type, config, indexer.indexes_path, args.force)
            else:
                logger.error(f"Unknown asset type: {asset_type}")
    else:
        # Index all types
        indexer.index_all(args.force)

if __name__ == "__main__":
    main() 
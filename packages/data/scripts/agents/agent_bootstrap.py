#!/usr/bin/env python3
"""
Agent Bootstrap Loader for kOS
Efficiently loads essential indexes and provides dynamic loading capabilities
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class AgentBootstrap:
    def __init__(self, project_root: str = "packages/data"):
        self.project_root = Path(project_root)
        self.indexes_path = self.project_root / "indexes"
        self.bootstrap_path = self.indexes_path / "bootstrap.json"
        
        # Cache for loaded chunks
        self.chunk_cache = {}
        self.bootstrap_data = None
        
        # Ensure we're in the right directory
        if not self.bootstrap_path.exists():
            # Try relative to current working directory
            self.bootstrap_path = Path("indexes/bootstrap.json")
        
    def load_bootstrap(self) -> Dict[str, Any]:
        """Load the bootstrap index (essential for agent startup)"""
        if not self.bootstrap_path.exists():
            logger.warning("Bootstrap index not found. Run asset_indexer.py first.")
            return {}
        
        try:
            with open(self.bootstrap_path, 'r') as f:
                self.bootstrap_data = json.load(f)
            
            logger.info(f"✅ Bootstrap loaded: {self.bootstrap_data['system']['totalAssets']} total assets")
            return self.bootstrap_data
            
        except Exception as e:
            logger.error(f"Failed to load bootstrap: {e}")
            return {}
    
    def get_critical_assets(self, asset_type: str = None) -> List[Dict[str, Any]]:
        """Get critical assets for immediate use"""
        if not self.bootstrap_data:
            self.load_bootstrap()
        
        critical = self.bootstrap_data.get('critical', {})
        
        if asset_type:
            return critical.get(f'core{asset_type.capitalize()}', [])
        
        # Return all critical assets
        all_critical = []
        for assets in critical.values():
            all_critical.extend(assets)
        
        return all_critical
    
    def load_chunk(self, asset_type: str, chunk_name: str) -> Optional[Dict[str, Any]]:
        """Dynamically load a specific chunk"""
        cache_key = f"{asset_type}/{chunk_name}"
        
        # Check cache first
        if cache_key in self.chunk_cache:
            return self.chunk_cache[cache_key]
        
        chunk_path = self.indexes_path / asset_type / f"{chunk_name}.json"
        
        if not chunk_path.exists():
            logger.warning(f"Chunk not found: {chunk_path}")
            return None
        
        try:
            with open(chunk_path, 'r') as f:
                chunk_data = json.load(f)
            
            # Cache the chunk
            self.chunk_cache[cache_key] = chunk_data
            
            logger.info(f"📦 Loaded chunk: {asset_type}/{chunk_name} ({len(chunk_data['files'])} files)")
            return chunk_data
            
        except Exception as e:
            logger.error(f"Failed to load chunk {chunk_path}: {e}")
            return None
    
    def search_assets(self, query: str, asset_types: List[str] = None, categories: List[str] = None) -> List[Dict]:
        """Search for assets across all indexed files"""
        if not self.bootstrap_data:
            self.load_bootstrap()
        
        if asset_types is None:
            asset_types = list(self.bootstrap_data.get('indexes', {}).keys())
        
        results = []
        
        for asset_type in asset_types:
            type_info = self.bootstrap_data.get('indexes', {}).get(asset_type, {})
            chunks = type_info.get('chunks', [])
            
            for chunk_name in chunks:
                chunk_data = self.load_chunk(asset_type, chunk_name)
                if not chunk_data:
                    continue
                
                # Filter by category if specified
                if categories and chunk_data.get('category') not in categories:
                    continue
                
                # Search in files
                for file_data in chunk_data.get('files', []):
                    if self.matches_search_query(file_data, query):
                        results.append({
                            **file_data,
                            "chunk": chunk_name,
                            "asset_type": asset_type
                        })
        
        return results
    
    def matches_search_query(self, file_data: Dict, query: str) -> bool:
        """Check if file data matches search query"""
        query_lower = query.lower()
        
        # Search in name
        if query_lower in file_data.get('name', '').lower():
            return True
        
        # Search in description
        if query_lower in file_data.get('description', '').lower():
            return True
        
        # Search in tags
        tags = file_data.get('tags', [])
        if any(query_lower in tag.lower() for tag in tags):
            return True
        
        # Search in path
        if query_lower in file_data.get('path', '').lower():
            return True
        
        return False
    
    def get_asset_by_path(self, asset_path: str) -> Optional[Dict[str, Any]]:
        """Get asset metadata by file path"""
        if not self.bootstrap_data:
            self.load_bootstrap()
        
        # Search through all chunks
        for asset_type, type_info in self.bootstrap_data.get('indexes', {}).items():
            for chunk_name in type_info.get('chunks', []):
                chunk_data = self.load_chunk(asset_type, chunk_name)
                if not chunk_data:
                    continue
                
                for file_data in chunk_data.get('files', []):
                    if file_data.get('path') == asset_path:
                        return {
                            **file_data,
                            "chunk": chunk_name,
                            "asset_type": asset_type
                        }
        
        return None
    
    def get_assets_by_type(self, asset_type: str, category: str = None) -> List[Dict]:
        """Get all assets of a specific type and optionally category"""
        if not self.bootstrap_data:
            self.load_bootstrap()
        
        type_info = self.bootstrap_data.get('indexes', {}).get(asset_type, {})
        chunks = type_info.get('chunks', [])
        
        all_assets = []
        
        for chunk_name in chunks:
            chunk_data = self.load_chunk(asset_type, chunk_name)
            if not chunk_data:
                continue
            
            # Filter by category if specified
            if category and chunk_data.get('category') != category:
                continue
            
            for file_data in chunk_data.get('files', []):
                all_assets.append({
                    **file_data,
                    "chunk": chunk_name,
                    "asset_type": asset_type
                })
        
        return all_assets
    
    def get_system_info(self) -> Dict[str, Any]:
        """Get system information from bootstrap"""
        if not self.bootstrap_data:
            self.load_bootstrap()
        
        if not self.bootstrap_data:
            return {}
        
        return self.bootstrap_data.get('system', {})
    
    def clear_cache(self):
        """Clear the chunk cache"""
        self.chunk_cache.clear()
        logger.info("🗑️ Chunk cache cleared")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            "cached_chunks": len(self.chunk_cache),
            "cache_keys": list(self.chunk_cache.keys()),
            "total_assets_in_cache": sum(
                len(chunk.get('files', [])) for chunk in self.chunk_cache.values()
            )
        }

def main():
    """Main function for testing"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Agent Bootstrap Loader for kOS")
    parser.add_argument("--search", type=str, help="Search for assets")
    parser.add_argument("--type", type=str, help="Asset type to list")
    parser.add_argument("--category", type=str, help="Category to filter by")
    parser.add_argument("--path", type=str, help="Get asset by path")
    parser.add_argument("--critical", action="store_true", help="Show critical assets")
    parser.add_argument("--stats", action="store_true", help="Show system stats")
    
    args = parser.parse_args()
    
    bootstrap = AgentBootstrap()
    
    if args.search:
        results = bootstrap.search_assets(args.search)
        print(f"Found {len(results)} results:")
        for result in results:
            print(f"  {result['name']} ({result['asset_type']}/{result['chunk']})")
    
    elif args.type:
        assets = bootstrap.get_assets_by_type(args.type, args.category)
        print(f"Found {len(assets)} {args.type} assets:")
        for asset in assets:
            print(f"  {asset['name']} ({asset['category']})")
    
    elif args.path:
        asset = bootstrap.get_asset_by_path(args.path)
        if asset:
            print(f"Asset: {asset['name']}")
            print(f"Type: {asset['asset_type']}")
            print(f"Category: {asset['category']}")
            print(f"Description: {asset.get('description', 'N/A')}")
        else:
            print("Asset not found")
    
    elif args.critical:
        critical = bootstrap.get_critical_assets()
        print(f"Critical assets ({len(critical)}):")
        for asset in critical:
            print(f"  {asset['name']} ({asset['type']})")
    
    elif args.stats:
        stats = bootstrap.get_system_info()
        print("System Statistics:")
        print(f"  Total Assets: {stats.get('totalAssets', 0)}")
        print(f"  Project Root: {stats.get('projectRoot', 'N/A')}")
        print(f"  Last Update: {stats.get('lastIndexUpdate', 'N/A')}")
        
        cache_stats = bootstrap.get_cache_stats()
        print(f"  Cached Chunks: {cache_stats['cached_chunks']}")
    
    else:
        # Default: show bootstrap info
        bootstrap_data = bootstrap.load_bootstrap()
        if bootstrap_data:
            print("Bootstrap loaded successfully!")
            print(f"Total assets: {bootstrap_data['system']['totalAssets']}")
            print(f"Indexes: {list(bootstrap_data.get('indexes', {}).keys())}")

if __name__ == "__main__":
    main() 
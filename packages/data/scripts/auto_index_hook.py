#!/usr/bin/env python3
"""
Auto-Indexing Hook for kOS
Automatically updates indexes when files change
"""

import os
import sys
import time
import json
from pathlib import Path
from typing import List, Set
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Add the scripts directory to path for imports
sys.path.append(str(Path(__file__).parent))

try:
    from asset_indexer import AssetIndexer
except ImportError:
    print("Asset indexer not found. Please ensure asset_indexer.py is in the same directory.")
    sys.exit(1)

logger = logging.getLogger(__name__)

class AssetChangeHandler(FileSystemEventHandler):
    def __init__(self, indexer: AssetIndexer, project_root: Path):
        self.indexer = indexer
        self.project_root = project_root
        self.changed_files: Set[str] = set()
        self.last_update = 0
        self.update_delay = 5  # seconds
        
        # Directories to watch
        self.watch_dirs = [
            project_root / "skills",
            project_root / "recipes", 
            project_root / "scripts",
            project_root / "config"
        ]
    
    def on_created(self, event):
        if not event.is_directory:
            self.handle_file_change(event.src_path, "created")
    
    def on_modified(self, event):
        if not event.is_directory:
            self.handle_file_change(event.src_path, "modified")
    
    def on_deleted(self, event):
        if not event.is_directory:
            self.handle_file_change(event.src_path, "deleted")
    
    def handle_file_change(self, file_path: str, change_type: str):
        """Handle file changes with debouncing"""
        file_path = Path(file_path)
        
        # Only track relevant files
        if self.is_relevant_file(file_path):
            self.changed_files.add(str(file_path))
            logger.info(f"📝 File {change_type}: {file_path.name}")
            
            # Schedule update
            current_time = time.time()
            if current_time - self.last_update > self.update_delay:
                self.schedule_update()
    
    def is_relevant_file(self, file_path: Path) -> bool:
        """Check if file is relevant for indexing"""
        relevant_extensions = {'.yaml', '.yml', '.json', '.py', '.sh', '.js', '.ts'}
        return file_path.suffix in relevant_extensions
    
    def schedule_update(self):
        """Schedule an index update"""
        self.last_update = time.time()
        
        # Use a timer to debounce rapid changes
        import threading
        timer = threading.Timer(self.update_delay, self.perform_update)
        timer.start()
    
    def perform_update(self):
        """Perform the actual index update"""
        if not self.changed_files:
            return
        
        logger.info(f"🔄 Updating indexes for {len(self.changed_files)} changed files...")
        
        try:
            # Update indexes
            self.indexer.index_all(force_update=True)
            
            # Clear changed files
            self.changed_files.clear()
            
            logger.info("✅ Indexes updated successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to update indexes: {e}")

def setup_git_hooks(project_root: Path):
    """Set up git hooks for automatic indexing"""
    git_hooks_dir = project_root.parent.parent / ".git" / "hooks"
    
    if not git_hooks_dir.exists():
        logger.warning("Git hooks directory not found. Skipping git hook setup.")
        return
    
    # Pre-commit hook
    pre_commit_hook = git_hooks_dir / "pre-commit"
    hook_content = f"""#!/bin/bash
# Auto-index hook for kOS
cd {project_root}
python3 scripts/auto_index_hook.py --git-hook
"""
    
    try:
        with open(pre_commit_hook, 'w') as f:
            f.write(hook_content)
        
        # Make executable
        os.chmod(pre_commit_hook, 0o755)
        logger.info("✅ Git pre-commit hook installed")
        
    except Exception as e:
        logger.error(f"Failed to install git hook: {e}")

def run_git_hook_update():
    """Run index update for git hook"""
    try:
        indexer = AssetIndexer()
        indexer.index_all(force_update=True)
        logger.info("✅ Git hook index update completed")
        return True
    except Exception as e:
        logger.error(f"❌ Git hook index update failed: {e}")
        return False

def start_file_watcher(project_root: Path):
    """Start file system watcher"""
    indexer = AssetIndexer(str(project_root))
    event_handler = AssetChangeHandler(indexer, project_root)
    observer = Observer()
    
    # Add watchers for each directory
    for watch_dir in event_handler.watch_dirs:
        if watch_dir.exists():
            observer.schedule(event_handler, str(watch_dir), recursive=True)
            logger.info(f"👀 Watching: {watch_dir}")
        else:
            logger.warning(f"Watch directory not found: {watch_dir}")
    
    observer.start()
    logger.info("🚀 File watcher started. Press Ctrl+C to stop.")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        logger.info("🛑 File watcher stopped")
    
    observer.join()

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Auto-Indexing Hook for kOS")
    parser.add_argument("--watch", action="store_true", help="Start file system watcher")
    parser.add_argument("--git-hook", action="store_true", help="Run as git hook")
    parser.add_argument("--setup-hooks", action="store_true", help="Set up git hooks")
    parser.add_argument("--update", action="store_true", help="Force update indexes")
    parser.add_argument("--project-root", type=str, default="packages/data", help="Project root path")
    
    args = parser.parse_args()
    
    project_root = Path(args.project_root)
    
    if args.git_hook:
        # Run as git hook
        success = run_git_hook_update()
        sys.exit(0 if success else 1)
    
    elif args.setup_hooks:
        # Set up git hooks
        setup_git_hooks(project_root)
    
    elif args.update:
        # Force update indexes
        indexer = AssetIndexer(str(project_root))
        indexer.index_all(force_update=True)
        logger.info("✅ Indexes updated")
    
    elif args.watch:
        # Start file watcher
        start_file_watcher(project_root)
    
    else:
        # Default: show help
        parser.print_help()

if __name__ == "__main__":
    main() 
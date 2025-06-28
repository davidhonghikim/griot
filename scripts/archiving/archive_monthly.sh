#!/bin/bash
# Monthly Archive Script for Agent Systems
# Usage: ./scripts/archive_monthly.sh [system_dir]
# Example: ./scripts/archive_monthly.sh agents/analysis
# Example: ./scripts/archive_monthly.sh agents/bootstrap
# Example: ./scripts/archive_monthly.sh agents/implementation-plans
# Example: ./scripts/archive_monthly.sh agents/performance

set -e

# If no system directory provided, archive all systems
if [ -z "$1" ]; then
    SYSTEMS=("agents/analysis" "agents/bootstrap" "agents/implementation-plans" "agents/performance")
    echo "Archiving all agent systems..."
else
    SYSTEMS=("$1")
    echo "Archiving system: $1"
fi

YEAR=$(date +%Y)
MONTH=$(date +%m)

for SYSTEM_DIR in "${SYSTEMS[@]}"; do
    if [ ! -d "$SYSTEM_DIR" ]; then
        echo "Warning: System directory $SYSTEM_DIR does not exist, skipping..."
        continue
    fi
    
    echo "Processing $SYSTEM_DIR..."
    
    # Find all files in root of system dir matching YYYY-MM-DD_*
    find "$SYSTEM_DIR" -maxdepth 1 -type f -name "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*.md" | while read FILE; do
        # Extract file's year and month
        FILENAME=$(basename "$FILE")
        FILE_YEAR=$(echo "$FILENAME" | cut -d- -f1)
        FILE_MONTH=$(echo "$FILENAME" | cut -d- -f2)
        
        # Only archive if not current month
        if [ "$FILE_YEAR" != "$YEAR" ] || [ "$FILE_MONTH" != "$MONTH" ]; then
            DEST="$SYSTEM_DIR/archive/$FILE_YEAR/$FILE_MONTH"
            mkdir -p "$DEST"
            mv "$FILE" "$DEST/"
            echo "  Archived $FILENAME to $DEST/"
        else
            echo "  Keeping $FILENAME (current month)"
        fi
    done
    
    # Also check for .json files with date patterns
    find "$SYSTEM_DIR" -maxdepth 1 -type f -name "[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]_*.json" | while read FILE; do
        FILENAME=$(basename "$FILE")
        FILE_YEAR=$(echo "$FILENAME" | cut -d- -f1)
        FILE_MONTH=$(echo "$FILENAME" | cut -d- -f2)
        
        if [ "$FILE_YEAR" != "$YEAR" ] || [ "$FILE_MONTH" != "$MONTH" ]; then
            DEST="$SYSTEM_DIR/archive/$FILE_YEAR/$FILE_MONTH"
            mkdir -p "$DEST"
            mv "$FILE" "$DEST/"
            echo "  Archived $FILENAME to $DEST/"
        else
            echo "  Keeping $FILENAME (current month)"
        fi
    done
done

echo "Archive process complete!" 
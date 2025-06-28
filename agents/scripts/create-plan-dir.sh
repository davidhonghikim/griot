#!/bin/bash
# A script to create a new implementation plan directory with the correct date format.

# Check if a plan name is provided
if [ -z "$1" ]; then
  echo "Error: Plan name is required."
  echo "Usage: $0 \"<plan-name>\""
  exit 1
fi

# Get the current date in YYYY-MM-DD format
CURRENT_DATE=$(date +%F)

# Sanitize the plan name to be used in a directory name
PLAN_NAME_SLUG=$(echo "$1" | tr '[:upper:]' '[:lower:]' | tr -s '[:space:]' '-' | sed 's/[^a-z0-9-]//g')

# Define the directory path
DIR_PATH="agents/implementation-plans/backlog/${CURRENT_DATE}_${PLAN_NAME_SLUG}"

# Create the directory
mkdir -p "$DIR_PATH"

echo "Successfully created plan directory: $DIR_PATH" 
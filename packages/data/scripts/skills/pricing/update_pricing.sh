#!/bin/bash

# AI Pricing Update and Self-Hosting Calculator
# Automates price aggregation and cost comparison

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PRICING_CONFIG="$PROJECT_ROOT/config/model_pricing.json"
BACKUP_DIR="$PROJECT_ROOT/config/backups"
LOG_FILE="$PROJECT_ROOT/logs/pricing_update.log"

# Create directories if they don't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check if Python is available
check_python() {
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is required but not installed"
        exit 1
    fi
    
    # Check for required packages
    python3 -c "import requests, json, re, datetime, pathlib" 2>/dev/null || {
        error "Required Python packages not found. Installing..."
        pip3 install requests
    }
}

# Function to backup current pricing
backup_pricing() {
    if [ -f "$PRICING_CONFIG" ]; then
        local backup_file="$BACKUP_DIR/model_pricing_$(date +'%Y%m%d_%H%M%S').json"
        cp "$PRICING_CONFIG" "$backup_file"
        log "Backup created: $backup_file"
    else
        warn "No existing pricing config found to backup"
    fi
}

# Function to update pricing
update_pricing() {
    log "Starting price aggregation..."
    
    cd "$SCRIPT_DIR"
    
    if python3 price_aggregator.py; then
        log "Price aggregation completed successfully"
        return 0
    else
        error "Price aggregation failed"
        return 1
    fi
}

# Function to generate self-hosting report
generate_self_hosting_report() {
    log "Generating self-hosting cost comparison..."
    
    cd "$SCRIPT_DIR"
    
    if python3 self_hosting_calculator.py; then
        log "Self-hosting report generated successfully"
        return 0
    else
        error "Self-hosting report generation failed"
        return 1
    fi
}

# Function to show pricing summary
show_pricing_summary() {
    if [ -f "$PRICING_CONFIG" ]; then
        log "Current pricing summary:"
        echo "========================"
        
        # Extract and display pricing info using jq if available
        if command -v jq &> /dev/null; then
            echo "Last Updated: $(jq -r '.lastUpdated' "$PRICING_CONFIG")"
            echo "Version: $(jq -r '.version' "$PRICING_CONFIG")"
            echo "Total Models: $(jq '.pricing | length' "$PRICING_CONFIG")"
            echo ""
            echo "Active Models:"
            jq -r '.pricing | to_entries[] | select(.value.isActive == true) | "  \(.key): $\(.value.input)/1M input, $\(.value.output)/1M output"' "$PRICING_CONFIG"
        else
            # Fallback to grep/sed
            echo "Last Updated: $(grep '"lastUpdated"' "$PRICING_CONFIG" | sed 's/.*"lastUpdated": "\(.*\)".*/\1/')"
            echo "Version: $(grep '"version"' "$PRICING_CONFIG" | sed 's/.*"version": "\(.*\)".*/\1/')"
            echo ""
            echo "Active Models (simplified):"
            grep -A 5 '"isActive": true' "$PRICING_CONFIG" | grep '"description"' | sed 's/.*"description": "\(.*\)".*/\1/'
        fi
    else
        error "Pricing config file not found"
    fi
}

# Function to show self-hosting recommendations
show_self_hosting_recommendations() {
    local report_file="$SCRIPT_DIR/self_hosting_report.json"
    
    if [ -f "$report_file" ]; then
        log "Self-hosting recommendations:"
        echo "============================="
        
        if command -v jq &> /dev/null; then
            jq -r '.recommendations[]' "$report_file"
        else
            # Fallback to grep
            grep -A 1 '"recommendations"' "$report_file" | grep -v '"recommendations"' | sed 's/.*"\(.*\)".*/\1/'
        fi
    else
        warn "Self-hosting report not found. Run with --generate-report first."
    fi
}

# Function to validate pricing config
validate_pricing_config() {
    if [ -f "$PRICING_CONFIG" ]; then
        log "Validating pricing configuration..."
        
        if command -v jq &> /dev/null; then
            if jq empty "$PRICING_CONFIG" 2>/dev/null; then
                log "Pricing config is valid JSON"
                
                # Check for required fields
                if jq -e '.pricing' "$PRICING_CONFIG" >/dev/null 2>&1; then
                    log "Pricing config has required fields"
                    return 0
                else
                    error "Pricing config missing required 'pricing' field"
                    return 1
                fi
            else
                error "Pricing config is not valid JSON"
                return 1
            fi
        else
            warn "jq not available, skipping JSON validation"
            return 0
        fi
    else
        error "Pricing config file not found"
        return 1
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --update-pricing        Update pricing from provider websites"
    echo "  --generate-report       Generate self-hosting cost comparison report"
    echo "  --show-summary          Show current pricing summary"
    echo "  --show-recommendations  Show self-hosting recommendations"
    echo "  --validate              Validate pricing configuration"
    echo "  --all                   Run all operations (update, report, summary)"
    echo "  --help                  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --update-pricing"
    echo "  $0 --generate-report"
    echo "  $0 --all"
}

# Main execution
main() {
    log "Starting AI pricing update and self-hosting calculator"
    
    # Check dependencies
    check_python
    
    # Parse arguments
    if [ $# -eq 0 ]; then
        show_usage
        exit 1
    fi
    
    local update_pricing_flag=false
    local generate_report_flag=false
    local show_summary_flag=false
    local show_recommendations_flag=false
    local validate_flag=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --update-pricing)
                update_pricing_flag=true
                shift
                ;;
            --generate-report)
                generate_report_flag=true
                shift
                ;;
            --show-summary)
                show_summary_flag=true
                shift
                ;;
            --show-recommendations)
                show_recommendations_flag=true
                shift
                ;;
            --validate)
                validate_flag=true
                shift
                ;;
            --all)
                update_pricing_flag=true
                generate_report_flag=true
                show_summary_flag=true
                show_recommendations_flag=true
                validate_flag=true
                shift
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Execute requested operations
    if [ "$validate_flag" = true ]; then
        validate_pricing_config
    fi
    
    if [ "$update_pricing_flag" = true ]; then
        backup_pricing
        if update_pricing; then
            log "Pricing update completed successfully"
        else
            error "Pricing update failed"
            exit 1
        fi
    fi
    
    if [ "$generate_report_flag" = true ]; then
        if generate_self_hosting_report; then
            log "Self-hosting report generated successfully"
        else
            error "Self-hosting report generation failed"
            exit 1
        fi
    fi
    
    if [ "$show_summary_flag" = true ]; then
        show_pricing_summary
    fi
    
    if [ "$show_recommendations_flag" = true ]; then
        show_self_hosting_recommendations
    fi
    
    log "All operations completed successfully"
}

# Run main function with all arguments
main "$@" 
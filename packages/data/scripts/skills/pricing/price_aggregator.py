#!/usr/bin/env python3
"""
AI Provider Price Aggregator
Scrapes pricing from various AI providers and updates the pricing configuration.
"""

import json
import requests
import re
from datetime import datetime
from typing import Dict, Any, List
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PriceAggregator:
    def __init__(self, config_path: str = "packages/data/config/model_pricing.json"):
        self.config_path = Path(config_path)
        self.pricing_data = self.load_current_pricing()
        
    def load_current_pricing(self) -> Dict[str, Any]:
        """Load current pricing configuration."""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Config file not found: {self.config_path}")
            return self.get_default_config()
    
    def get_default_config(self) -> Dict[str, Any]:
        """Get default pricing configuration."""
        return {
            "version": "1.0.0",
            "lastUpdated": datetime.now().isoformat(),
            "description": "AI model pricing per 1M tokens (USD)",
            "pricing": {},
            "mediaPricing": {},
            "metadata": {
                "updateFrequency": "weekly",
                "dataSource": "automated_scraping",
                "notes": "Prices are per 1M tokens for text models, per unit for media"
            }
        }
    
    def scrape_openai_pricing(self) -> Dict[str, Any]:
        """Scrape pricing from OpenAI's pricing page."""
        logger.info("Scraping OpenAI pricing...")
        
        try:
            # OpenAI pricing page
            url = "https://openai.com/pricing"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            content = response.text
            
            # Extract pricing using regex patterns
            pricing = {}
            
            # GPT-4 patterns
            gpt4_patterns = [
                r'GPT-4.*?(\$[\d.]+).*?per 1M input tokens',
                r'GPT-4.*?(\$[\d.]+).*?per 1M output tokens'
            ]
            
            # GPT-3.5 patterns
            gpt35_patterns = [
                r'GPT-3\.5.*?(\$[\d.]+).*?per 1M input tokens',
                r'GPT-3\.5.*?(\$[\d.]+).*?per 1M output tokens'
            ]
            
            # Extract and parse prices
            # Note: This is a simplified approach - production should use more robust parsing
            pricing.update(self.parse_openai_prices(content))
            
            return pricing
            
        except Exception as e:
            logger.error(f"Failed to scrape OpenAI pricing: {e}")
            return {}
    
    def parse_openai_prices(self, content: str) -> Dict[str, Any]:
        """Parse OpenAI pricing from HTML content."""
        pricing = {}
        
        # Simplified regex patterns for price extraction
        # In production, use proper HTML parsing with BeautifulSoup
        
        # GPT-4 Turbo
        gpt4_turbo_input = re.search(r'GPT-4 Turbo.*?(\$[\d.]+).*?input', content)
        gpt4_turbo_output = re.search(r'GPT-4 Turbo.*?(\$[\d.]+).*?output', content)
        
        if gpt4_turbo_input and gpt4_turbo_output:
            pricing['gpt-4-turbo'] = {
                "input": float(gpt4_turbo_input.group(1).replace('$', '')),
                "output": float(gpt4_turbo_output.group(1).replace('$', '')),
                "description": "GPT-4 Turbo with 128K context",
                "provider": "OpenAI",
                "isActive": True
            }
        
        # GPT-3.5 Turbo
        gpt35_turbo_input = re.search(r'GPT-3\.5 Turbo.*?(\$[\d.]+).*?input', content)
        gpt35_turbo_output = re.search(r'GPT-3\.5 Turbo.*?(\$[\d.]+).*?output', content)
        
        if gpt35_turbo_input and gpt35_turbo_output:
            pricing['gpt-3.5-turbo'] = {
                "input": float(gpt35_turbo_input.group(1).replace('$', '')),
                "output": float(gpt35_turbo_output.group(1).replace('$', '')),
                "description": "GPT-3.5 Turbo",
                "provider": "OpenAI",
                "isActive": True
            }
        
        return pricing
    
    def scrape_anthropic_pricing(self) -> Dict[str, Any]:
        """Scrape pricing from Anthropic's pricing page."""
        logger.info("Scraping Anthropic pricing...")
        
        try:
            url = "https://www.anthropic.com/pricing"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            content = response.text
            return self.parse_anthropic_prices(content)
            
        except Exception as e:
            logger.error(f"Failed to scrape Anthropic pricing: {e}")
            return {}
    
    def parse_anthropic_prices(self, content: str) -> Dict[str, Any]:
        """Parse Anthropic pricing from HTML content."""
        pricing = {}
        
        # Claude 3 Opus
        claude_opus_input = re.search(r'Claude 3 Opus.*?(\$[\d.]+).*?input', content)
        claude_opus_output = re.search(r'Claude 3 Opus.*?(\$[\d.]+).*?output', content)
        
        if claude_opus_input and claude_opus_output:
            pricing['claude-3-opus'] = {
                "input": float(claude_opus_input.group(1).replace('$', '')),
                "output": float(claude_opus_output.group(1).replace('$', '')),
                "description": "Claude 3 Opus",
                "provider": "Anthropic",
                "isActive": True
            }
        
        # Claude 3 Sonnet
        claude_sonnet_input = re.search(r'Claude 3 Sonnet.*?(\$[\d.]+).*?input', content)
        claude_sonnet_output = re.search(r'Claude 3 Sonnet.*?(\$[\d.]+).*?output', content)
        
        if claude_sonnet_input and claude_sonnet_output:
            pricing['claude-3-sonnet'] = {
                "input": float(claude_sonnet_input.group(1).replace('$', '')),
                "output": float(claude_sonnet_output.group(1).replace('$', '')),
                "description": "Claude 3 Sonnet",
                "provider": "Anthropic",
                "isActive": True
            }
        
        # Claude 3 Haiku
        claude_haiku_input = re.search(r'Claude 3 Haiku.*?(\$[\d.]+).*?input', content)
        claude_haiku_output = re.search(r'Claude 3 Haiku.*?(\$[\d.]+).*?output', content)
        
        if claude_haiku_input and claude_haiku_output:
            pricing['claude-3-haiku'] = {
                "input": float(claude_haiku_input.group(1).replace('$', '')),
                "output": float(claude_haiku_output.group(1).replace('$', '')),
                "description": "Claude 3 Haiku",
                "provider": "Anthropic",
                "isActive": True
            }
        
        return pricing
    
    def scrape_google_pricing(self) -> Dict[str, Any]:
        """Scrape pricing from Google's AI pricing page."""
        logger.info("Scraping Google AI pricing...")
        
        try:
            url = "https://ai.google.dev/pricing"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            content = response.text
            return self.parse_google_prices(content)
            
        except Exception as e:
            logger.error(f"Failed to scrape Google pricing: {e}")
            return {}
    
    def parse_google_prices(self, content: str) -> Dict[str, Any]:
        """Parse Google AI pricing from HTML content."""
        pricing = {}
        
        # Gemini Pro
        gemini_pro_input = re.search(r'Gemini Pro.*?(\$[\d.]+).*?input', content)
        gemini_pro_output = re.search(r'Gemini Pro.*?(\$[\d.]+).*?output', content)
        
        if gemini_pro_input and gemini_pro_output:
            pricing['gemini-pro'] = {
                "input": float(gemini_pro_input.group(1).replace('$', '')),
                "output": float(gemini_pro_output.group(1).replace('$', '')),
                "description": "Gemini Pro",
                "provider": "Google",
                "isActive": True
            }
        
        return pricing
    
    def get_manual_pricing(self) -> Dict[str, Any]:
        """Get manually curated pricing for models that can't be scraped."""
        return {
            'llama-2-70b': {
                "input": 0.7,
                "output": 0.8,
                "description": "Llama 2 70B (self-hosted estimate)",
                "provider": "Meta",
                "isActive": True
            },
            'gpt-4': {
                "input": 30.0,
                "output": 60.0,
                "description": "GPT-4 with 8K context",
                "provider": "OpenAI",
                "isActive": True
            }
        }
    
    def aggregate_pricing(self) -> Dict[str, Any]:
        """Aggregate pricing from all sources."""
        logger.info("Aggregating pricing from all sources...")
        
        # Scrape from various providers
        openai_pricing = self.scrape_openai_pricing()
        anthropic_pricing = self.scrape_anthropic_pricing()
        google_pricing = self.scrape_google_pricing()
        manual_pricing = self.get_manual_pricing()
        
        # Combine all pricing
        all_pricing = {}
        all_pricing.update(openai_pricing)
        all_pricing.update(anthropic_pricing)
        all_pricing.update(google_pricing)
        all_pricing.update(manual_pricing)
        
        # Update configuration
        self.pricing_data['pricing'] = all_pricing
        self.pricing_data['lastUpdated'] = datetime.now().isoformat()
        self.pricing_data['version'] = self.increment_version(self.pricing_data['version'])
        
        return self.pricing_data
    
    def increment_version(self, version: str) -> str:
        """Increment version number."""
        parts = version.split('.')
        if len(parts) >= 3:
            parts[2] = str(int(parts[2]) + 1)
        return '.'.join(parts)
    
    def save_pricing(self, pricing_data: Dict[str, Any]) -> None:
        """Save pricing data to configuration file."""
        try:
            # Create backup of current config
            backup_path = self.config_path.with_suffix('.json.backup')
            if self.config_path.exists():
                self.config_path.rename(backup_path)
            
            # Save new config
            with open(self.config_path, 'w') as f:
                json.dump(pricing_data, f, indent=2)
            
            logger.info(f"Pricing configuration updated: {self.config_path}")
            logger.info(f"Backup saved: {backup_path}")
            
        except Exception as e:
            logger.error(f"Failed to save pricing configuration: {e}")
    
    def run(self) -> None:
        """Run the price aggregation process."""
        logger.info("Starting price aggregation...")
        
        try:
            pricing_data = self.aggregate_pricing()
            self.save_pricing(pricing_data)
            
            logger.info("Price aggregation completed successfully!")
            
        except Exception as e:
            logger.error(f"Price aggregation failed: {e}")

def main():
    """Main entry point."""
    aggregator = PriceAggregator()
    aggregator.run()

if __name__ == "__main__":
    main() 
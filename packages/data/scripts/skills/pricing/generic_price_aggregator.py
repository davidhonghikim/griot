#!/usr/bin/env python3
"""
Generic AI Provider Price Aggregator
Dynamically scrapes pricing from any configured AI provider.
"""

import json
import requests
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
import logging
from pathlib import Path
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GenericPriceAggregator:
    def __init__(
        self,
        pricing_config_path: str = "packages/data/config/model_pricing.json",
        provider_config_path: str = "packages/data/config/provider_config.json"
    ):
        self.pricing_config_path = Path(pricing_config_path)
        self.provider_config_path = Path(provider_config_path)
        self.pricing_data = self.load_pricing_config()
        self.provider_config = self.load_provider_config()
        
    def load_pricing_config(self) -> Dict[str, Any]:
        """Load pricing configuration."""
        try:
            with open(self.pricing_config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(f"Pricing config not found: {self.pricing_config_path}")
            return self.get_default_pricing_config()
    
    def load_provider_config(self) -> Dict[str, Any]:
        """Load provider configuration."""
        try:
            with open(self.provider_config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Provider config not found: {self.provider_config_path}")
            return {}
    
    def get_default_pricing_config(self) -> Dict[str, Any]:
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
    
    def scrape_provider_pricing(self, provider_id: str) -> Dict[str, Any]:
        """Scrape pricing for a specific provider."""
        if provider_id not in self.provider_config.get("providers", {}):
            logger.warning(f"Provider {provider_id} not found in configuration")
            return {}
        
        provider = self.provider_config["providers"][provider_id]
        
        if not provider.get("isActive", False):
            logger.info(f"Provider {provider_id} is not active, skipping")
            return {}
        
        scraping_config = provider.get("scraping", {})
        if not scraping_config.get("enabled", False):
            logger.info(f"Scraping not enabled for provider {provider_id}")
            return {}
        
        method = scraping_config.get("method")
        if method == "web_scraping":
            return self.scrape_web_pricing(provider_id, provider)
        elif method == "api":
            return self.scrape_api_pricing(provider_id, provider)
        elif method == "manual":
            return self.get_manual_pricing(provider_id, provider)
        else:
            logger.warning(f"Unknown scraping method: {method}")
            return {}
    
    def scrape_web_pricing(self, provider_id: str, provider: Dict[str, Any]) -> Dict[str, Any]:
        """Scrape pricing from provider website."""
        website = provider.get("website")
        if not website:
            logger.warning(f"No website configured for provider {provider_id}")
            return {}
        
        logger.info(f"Scraping {provider['name']} pricing from {website}")
        
        try:
            # Get scraping configuration
            scraping_config = provider.get("scraping", {})
            timeout = self.provider_config.get("scrapingMethods", {}).get("web_scraping", {}).get("timeout", 10)
            retries = self.provider_config.get("scrapingMethods", {}).get("web_scraping", {}).get("retries", 3)
            
            # Attempt scraping with retries
            for attempt in range(retries):
                try:
                    response = requests.get(website, timeout=timeout)
                    response.raise_for_status()
                    content = response.text
                    break
                except requests.RequestException as e:
                    if attempt == retries - 1:
                        raise e
                    logger.warning(f"Attempt {attempt + 1} failed for {provider_id}, retrying...")
                    time.sleep(2 ** attempt)  # Exponential backoff
            
            # Parse pricing using configured selectors
            return self.parse_web_pricing(provider_id, provider, content)
            
        except Exception as e:
            logger.error(f"Failed to scrape {provider_id} pricing: {e}")
            return {}
    
    def parse_web_pricing(self, provider_id: str, provider: Dict[str, Any], content: str) -> Dict[str, Any]:
        """Parse pricing from web content using configured selectors."""
        pricing = {}
        selectors = provider.get("scraping", {}).get("selectors", {})
        
        for model_id, model_selectors in selectors.items():
            input_pattern = model_selectors.get("input")
            output_pattern = model_selectors.get("output")
            
            if input_pattern and output_pattern:
                input_match = re.search(input_pattern, content)
                output_match = re.search(output_pattern, content)
                
                if input_match and output_match:
                    try:
                        input_price = float(input_match.group(1).replace('$', ''))
                        output_price = float(output_match.group(1).replace('$', ''))
                        
                        pricing[model_id] = {
                            "input": input_price,
                            "output": output_price,
                            "description": f"{model_id.replace('-', ' ').title()}",
                            "provider": provider["name"],
                            "isActive": True
                        }
                        
                        logger.info(f"Found pricing for {model_id}: ${input_price}/1M input, ${output_price}/1M output")
                        
                    except (ValueError, IndexError) as e:
                        logger.warning(f"Failed to parse pricing for {model_id}: {e}")
        
        return pricing
    
    def scrape_api_pricing(self, provider_id: str, provider: Dict[str, Any]) -> Dict[str, Any]:
        """Scrape pricing via provider API."""
        api_config = provider.get("api", {})
        endpoint = api_config.get("endpoint")
        
        if not endpoint:
            logger.warning(f"No API endpoint configured for provider {provider_id}")
            return {}
        
        logger.info(f"Scraping {provider['name']} pricing via API")
        
        try:
            # This is a placeholder - implement actual API calls based on provider
            # Each provider may have different API structures
            timeout = self.provider_config.get("scrapingMethods", {}).get("api", {}).get("timeout", 30)
            
            # Example API call (customize per provider)
            headers = {}
            if api_config.get("auth_required", False):
                # Add authentication headers
                pass
            
            response = requests.get(endpoint, headers=headers, timeout=timeout)
            response.raise_for_status()
            
            # Parse API response (customize per provider)
            return self.parse_api_pricing(provider_id, provider, response.json())
            
        except Exception as e:
            logger.error(f"Failed to scrape {provider_id} API pricing: {e}")
            return {}
    
    def parse_api_pricing(self, provider_id: str, provider: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse pricing from API response."""
        # This is a placeholder - implement based on actual API responses
        # Each provider will have different response formats
        pricing = {}
        
        # Example parsing (customize per provider)
        if "models" in data:
            for model in data["models"]:
                model_id = model.get("id")
                if model_id:
                    pricing[model_id] = {
                        "input": model.get("input_price", 0),
                        "output": model.get("output_price", 0),
                        "description": model.get("description", model_id),
                        "provider": provider["name"],
                        "isActive": True
                    }
        
        return pricing
    
    def get_manual_pricing(self, provider_id: str, provider: Dict[str, Any]) -> Dict[str, Any]:
        """Get manually curated pricing for a provider."""
        logger.info(f"Getting manual pricing for {provider['name']}")
        
        # Define manual pricing for providers that can't be scraped
        manual_pricing = {
            "meta": {
                "llama-2-70b": {
                    "input": 0.7,
                    "output": 0.8,
                    "description": "Llama 2 70B (self-hosted estimate)",
                    "provider": "Meta",
                    "isActive": True
                }
            }
        }
        
        return manual_pricing.get(provider_id, {})
    
    def aggregate_all_pricing(self) -> Dict[str, Any]:
        """Aggregate pricing from all configured providers."""
        logger.info("Aggregating pricing from all providers...")
        
        all_pricing = {}
        
        # Scrape from all active providers
        for provider_id in self.provider_config.get("providers", {}):
            provider_pricing = self.scrape_provider_pricing(provider_id)
            all_pricing.update(provider_pricing)
        
        # Update configuration
        self.pricing_data['pricing'] = all_pricing
        self.pricing_data['lastUpdated'] = datetime.now().isoformat()
        self.pricing_data['version'] = self.increment_version(self.pricing_data['version'])
        
        logger.info(f"Aggregated pricing for {len(all_pricing)} models from {len(self.provider_config.get('providers', {}))} providers")
        
        return self.pricing_data
    
    def add_provider(self, provider_id: str, provider_config: Dict[str, Any]) -> bool:
        """Add a new provider to the configuration."""
        try:
            if "providers" not in self.provider_config:
                self.provider_config["providers"] = {}
            
            self.provider_config["providers"][provider_id] = provider_config
            self.save_provider_config()
            
            logger.info(f"Added provider {provider_id}: {provider_config.get('name', 'Unknown')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to add provider {provider_id}: {e}")
            return False
    
    def remove_provider(self, provider_id: str) -> bool:
        """Remove a provider from the configuration."""
        try:
            if provider_id in self.provider_config.get("providers", {}):
                del self.provider_config["providers"][provider_id]
                self.save_provider_config()
                
                logger.info(f"Removed provider {provider_id}")
                return True
            else:
                logger.warning(f"Provider {provider_id} not found")
                return False
                
        except Exception as e:
            logger.error(f"Failed to remove provider {provider_id}: {e}")
            return False
    
    def increment_version(self, version: str) -> str:
        """Increment version number."""
        parts = version.split('.')
        if len(parts) >= 3:
            parts[2] = str(int(parts[2]) + 1)
        return '.'.join(parts)
    
    def save_pricing_config(self, pricing_data: Dict[str, Any]) -> None:
        """Save pricing data to configuration file."""
        try:
            # Create backup
            backup_path = self.pricing_config_path.with_suffix('.json.backup')
            if self.pricing_config_path.exists():
                self.pricing_config_path.rename(backup_path)
            
            # Save new config
            with open(self.pricing_config_path, 'w') as f:
                json.dump(pricing_data, f, indent=2)
            
            logger.info(f"Pricing configuration updated: {self.pricing_config_path}")
            logger.info(f"Backup saved: {backup_path}")
            
        except Exception as e:
            logger.error(f"Failed to save pricing configuration: {e}")
    
    def save_provider_config(self) -> None:
        """Save provider configuration."""
        try:
            with open(self.provider_config_path, 'w') as f:
                json.dump(self.provider_config, f, indent=2)
            
            logger.info(f"Provider configuration updated: {self.provider_config_path}")
            
        except Exception as e:
            logger.error(f"Failed to save provider configuration: {e}")
    
    def list_providers(self) -> List[Dict[str, Any]]:
        """List all configured providers."""
        providers = []
        
        for provider_id, provider in self.provider_config.get("providers", {}).items():
            providers.append({
                "id": provider_id,
                "name": provider.get("name", "Unknown"),
                "isActive": provider.get("isActive", False),
                "scraping_enabled": provider.get("scraping", {}).get("enabled", False),
                "method": provider.get("scraping", {}).get("method", "none")
            })
        
        return providers
    
    def run(self) -> None:
        """Run the generic price aggregation process."""
        logger.info("Starting generic price aggregation...")
        
        try:
            pricing_data = self.aggregate_all_pricing()
            self.save_pricing_config(pricing_data)
            
            logger.info("Generic price aggregation completed successfully!")
            
        except Exception as e:
            logger.error(f"Generic price aggregation failed: {e}")

def main():
    """Main entry point."""
    aggregator = GenericPriceAggregator()
    
    # Example: Add a new provider
    # new_provider = {
    #     "name": "New AI Company",
    #     "website": "https://newai.com/pricing",
    #     "scraping": {
    #         "enabled": True,
    #         "method": "web_scraping",
    #         "selectors": {
    #             "new-model": {
    #                 "input": "New Model.*?(\\$[\\d.]+).*?input",
    #                 "output": "New Model.*?(\\$[\\d.]+).*?output"
    #             }
    #         }
    #     },
    #     "api": {"enabled": False, "endpoint": None, "auth_required": False},
    #     "isActive": True
    # }
    # aggregator.add_provider("newai", new_provider)
    
    aggregator.run()

if __name__ == "__main__":
    main() 
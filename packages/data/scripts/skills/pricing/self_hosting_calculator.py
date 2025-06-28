#!/usr/bin/env python3
"""
Self-Hosting Cost Calculator
Calculates and compares costs between self-hosting AI models and using cloud APIs.
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SelfHostingCalculator:
    def __init__(self, pricing_config_path: str = "packages/data/config/model_pricing.json"):
        self.pricing_config_path = Path(pricing_config_path)
        self.pricing_data = self.load_pricing_config()
        self.hardware_costs = self.load_hardware_costs()
        
    def load_pricing_config(self) -> Dict[str, Any]:
        """Load pricing configuration."""
        try:
            with open(self.pricing_config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Pricing config not found: {self.pricing_config_path}")
            return {}
    
    def load_hardware_costs(self) -> Dict[str, Any]:
        """Load hardware cost configurations."""
        return {
            "gpu_costs": {
                "rtx_4090": {
                    "price": 1600,
                    "power_consumption": 450,  # watts
                    "memory": 24,  # GB
                    "performance": "high",
                    "models_supported": ["llama-2-70b", "mistral-7b", "codellama-34b"]
                },
                "rtx_3090": {
                    "price": 800,
                    "power_consumption": 350,
                    "memory": 24,
                    "performance": "high",
                    "models_supported": ["llama-2-70b", "mistral-7b", "codellama-34b"]
                },
                "rtx_4080": {
                    "price": 1200,
                    "power_consumption": 320,
                    "memory": 16,
                    "performance": "medium",
                    "models_supported": ["llama-2-13b", "mistral-7b", "codellama-13b"]
                },
                "rtx_4070": {
                    "price": 600,
                    "power_consumption": 200,
                    "memory": 12,
                    "performance": "medium",
                    "models_supported": ["llama-2-7b", "mistral-7b", "codellama-7b"]
                }
            },
            "system_costs": {
                "cpu": 300,
                "motherboard": 200,
                "ram_32gb": 150,
                "ram_64gb": 300,
                "storage_1tb": 100,
                "storage_2tb": 200,
                "power_supply": 150,
                "case": 100,
                "cooling": 100
            },
            "operational_costs": {
                "electricity_rate": 0.12,  # USD per kWh
                "internet_monthly": 80,
                "maintenance_monthly": 50,
                "depreciation_years": 3
            }
        }
    
    def calculate_self_hosting_costs(
        self,
        gpu_model: str,
        usage_hours_per_day: float = 8,
        days_per_month: int = 30,
        months: int = 12
    ) -> Dict[str, Any]:
        """Calculate total self-hosting costs."""
        
        if gpu_model not in self.hardware_costs["gpu_costs"]:
            raise ValueError(f"GPU model {gpu_model} not found in hardware costs")
        
        gpu = self.hardware_costs["gpu_costs"][gpu_model]
        operational = self.hardware_costs["operational_costs"]
        system = self.hardware_costs["system_costs"]
        
        # Hardware costs
        total_hardware_cost = (
            gpu["price"] +
            system["cpu"] +
            system["motherboard"] +
            system["ram_64gb"] +
            system["storage_2tb"] +
            system["power_supply"] +
            system["case"] +
            system["cooling"]
        )
        
        # Monthly operational costs
        monthly_electricity = (
            (gpu["power_consumption"] / 1000) *  # Convert to kW
            usage_hours_per_day *
            days_per_month *
            operational["electricity_rate"]
        )
        
        monthly_operational = (
            monthly_electricity +
            operational["internet_monthly"] +
            operational["maintenance_monthly"]
        )
        
        # Depreciation
        monthly_depreciation = total_hardware_cost / (operational["depreciation_years"] * 12)
        
        # Total monthly cost
        total_monthly_cost = monthly_operational + monthly_depreciation
        
        # Total cost for the period
        total_cost = total_hardware_cost + (total_monthly_cost * months)
        
        # Cost per hour of usage
        total_hours = usage_hours_per_day * days_per_month * months
        cost_per_hour = total_cost / total_hours if total_hours > 0 else 0
        
        return {
            "hardware_cost": total_hardware_cost,
            "monthly_operational_cost": monthly_operational,
            "monthly_depreciation": monthly_depreciation,
            "total_monthly_cost": total_monthly_cost,
            "total_cost": total_cost,
            "cost_per_hour": cost_per_hour,
            "total_hours": total_hours,
            "gpu_model": gpu_model,
            "usage_hours_per_day": usage_hours_per_day,
            "period_months": months
        }
    
    def calculate_cloud_api_costs(
        self,
        tokens_per_month: int,
        model: str = "gpt-4-turbo",
        months: int = 12
    ) -> Dict[str, Any]:
        """Calculate cloud API costs for the same period."""
        
        if model not in self.pricing_data.get("pricing", {}):
            raise ValueError(f"Model {model} not found in pricing data")
        
        model_pricing = self.pricing_data["pricing"][model]
        
        # Assume 80% input tokens, 20% output tokens
        input_tokens = int(tokens_per_month * 0.8)
        output_tokens = int(tokens_per_month * 0.2)
        
        # Calculate costs per 1M tokens
        input_cost = (input_tokens / 1_000_000) * model_pricing["input"]
        output_cost = (output_tokens / 1_000_000) * model_pricing["output"]
        
        monthly_cost = input_cost + output_cost
        total_cost = monthly_cost * months
        
        return {
            "model": model,
            "tokens_per_month": tokens_per_month,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "monthly_cost": monthly_cost,
            "total_cost": total_cost,
            "cost_per_1M_tokens": model_pricing["input"] + model_pricing["output"],
            "period_months": months
        }
    
    def compare_costs(
        self,
        gpu_model: str,
        tokens_per_month: int,
        usage_hours_per_day: float = 8,
        months: int = 12,
        cloud_model: str = "gpt-4-turbo"
    ) -> Dict[str, Any]:
        """Compare self-hosting vs cloud API costs."""
        
        self_hosting = self.calculate_self_hosting_costs(gpu_model, usage_hours_per_day, 30, months)
        cloud_api = self.calculate_cloud_api_costs(tokens_per_month, cloud_model, months)
        
        # Calculate savings
        savings = cloud_api["total_cost"] - self_hosting["total_cost"]
        savings_percentage = (savings / cloud_api["total_cost"]) * 100 if cloud_api["total_cost"] > 0 else 0
        
        # Calculate break-even point
        break_even_months = self_hosting["hardware_cost"] / (cloud_api["monthly_cost"] - self_hosting["total_monthly_cost"])
        break_even_months = max(0, break_even_months) if cloud_api["monthly_cost"] > self_hosting["total_monthly_cost"] else float('inf')
        
        return {
            "self_hosting": self_hosting,
            "cloud_api": cloud_api,
            "comparison": {
                "savings": savings,
                "savings_percentage": savings_percentage,
                "break_even_months": break_even_months,
                "recommendation": self.get_recommendation(savings, break_even_months, months)
            }
        }
    
    def get_recommendation(self, savings: float, break_even_months: float, total_months: int) -> str:
        """Get recommendation based on cost comparison."""
        if savings > 0:
            if break_even_months <= total_months:
                return f"Self-hosting is recommended. You'll save ${savings:.2f} over {total_months} months. Break-even in {break_even_months:.1f} months."
            else:
                return f"Self-hosting saves ${savings:.2f} but break-even is {break_even_months:.1f} months. Consider longer-term usage."
        else:
            return f"Cloud API is cheaper by ${abs(savings):.2f}. Self-hosting may not be cost-effective for your usage."
    
    def generate_cost_report(
        self,
        gpu_models: List[str] = None,
        token_volumes: List[int] = None,
        months: int = 12
    ) -> Dict[str, Any]:
        """Generate comprehensive cost comparison report."""
        
        if gpu_models is None:
            gpu_models = ["rtx_4070", "rtx_4080", "rtx_3090", "rtx_4090"]
        
        if token_volumes is None:
            token_volumes = [1_000_000, 5_000_000, 10_000_000, 50_000_000, 100_000_000]
        
        cloud_models = ["gpt-3.5-turbo", "gpt-4-turbo", "claude-3-haiku", "claude-3-sonnet"]
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "period_months": months,
            "comparisons": {},
            "recommendations": []
        }
        
        # Generate comparisons for different scenarios
        for tokens in token_volumes:
            report["comparisons"][f"{tokens:,} tokens/month"] = {}
            
            for gpu in gpu_models:
                report["comparisons"][f"{tokens:,} tokens/month"][gpu] = {}
                
                for cloud_model in cloud_models:
                    try:
                        comparison = self.compare_costs(gpu, tokens, 8, months, cloud_model)
                        report["comparisons"][f"{tokens:,} tokens/month"][gpu][cloud_model] = comparison
                    except Exception as e:
                        logger.warning(f"Failed to compare {gpu} vs {cloud_model} for {tokens} tokens: {e}")
        
        # Generate recommendations
        report["recommendations"] = self.generate_recommendations(report["comparisons"])
        
        return report
    
    def generate_recommendations(self, comparisons: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on cost comparisons."""
        recommendations = []
        
        # Find best self-hosting options
        best_savings = {}
        for token_volume, gpu_comparisons in comparisons.items():
            for gpu, cloud_comparisons in gpu_comparisons.items():
                for cloud_model, comparison in cloud_comparisons.items():
                    savings = comparison["comparison"]["savings"]
                    if savings > 0:
                        if token_volume not in best_savings or savings > best_savings[token_volume]["savings"]:
                            best_savings[token_volume] = {
                                "gpu": gpu,
                                "cloud_model": cloud_model,
                                "savings": savings
                            }
        
        for token_volume, best in best_savings.items():
            recommendations.append(
                f"For {token_volume}: {best['gpu']} vs {best['cloud_model']} saves ${best['savings']:.2f}"
            )
        
        return recommendations
    
    def save_report(self, report: Dict[str, Any], output_path: str = "self_hosting_report.json") -> None:
        """Save cost comparison report to file."""
        try:
            with open(output_path, 'w') as f:
                json.dump(report, f, indent=2)
            logger.info(f"Cost comparison report saved: {output_path}")
        except Exception as e:
            logger.error(f"Failed to save report: {e}")
    
    def print_summary(self, comparison: Dict[str, Any]) -> None:
        """Print a summary of the cost comparison."""
        print("\n" + "="*60)
        print("SELF-HOSTING vs CLOUD API COST COMPARISON")
        print("="*60)
        
        self_hosting = comparison["self_hosting"]
        cloud_api = comparison["cloud_api"]
        comp = comparison["comparison"]
        
        print(f"\nSelf-Hosting ({self_hosting['gpu_model']}):")
        print(f"  Hardware Cost: ${self_hosting['hardware_cost']:,.2f}")
        print(f"  Monthly Cost: ${self_hosting['total_monthly_cost']:,.2f}")
        print(f"  Total Cost ({self_hosting['period_months']} months): ${self_hosting['total_cost']:,.2f}")
        
        print(f"\nCloud API ({cloud_api['model']}):")
        print(f"  Monthly Cost: ${cloud_api['monthly_cost']:,.2f}")
        print(f"  Total Cost ({cloud_api['period_months']} months): ${cloud_api['total_cost']:,.2f}")
        
        print(f"\nComparison:")
        print(f"  Savings: ${comp['savings']:,.2f}")
        print(f"  Savings %: {comp['savings_percentage']:.1f}%")
        print(f"  Break-even: {comp['break_even_months']:.1f} months")
        print(f"  Recommendation: {comp['recommendation']}")
        print("="*60)

def main():
    """Main entry point."""
    calculator = SelfHostingCalculator()
    
    # Example usage
    print("Self-Hosting Cost Calculator")
    print("="*40)
    
    # Calculate for different scenarios
    scenarios = [
        {"gpu": "rtx_4070", "tokens": 5_000_000, "model": "gpt-4-turbo"},
        {"gpu": "rtx_4090", "tokens": 10_000_000, "model": "gpt-4-turbo"},
        {"gpu": "rtx_3090", "tokens": 50_000_000, "model": "claude-3-sonnet"},
    ]
    
    for scenario in scenarios:
        try:
            comparison = calculator.compare_costs(
                scenario["gpu"],
                scenario["tokens"],
                usage_hours_per_day=8,
                months=12,
                cloud_model=scenario["model"]
            )
            calculator.print_summary(comparison)
        except Exception as e:
            logger.error(f"Failed to calculate for scenario {scenario}: {e}")
    
    # Generate comprehensive report
    print("\nGenerating comprehensive cost report...")
    report = calculator.generate_cost_report()
    calculator.save_report(report)

if __name__ == "__main__":
    main() 
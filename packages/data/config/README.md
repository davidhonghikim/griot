# Configuration System

This directory contains configuration files that can be updated without changing code.

## 📁 **Files**

### **model_pricing.json**
Contains current pricing for all supported AI models.

## 🔧 **Updating Model Pricing**

### **When to Update**
- When AI providers change their pricing
- When new models become available
- When you want to add custom models

### **How to Update**
1. Edit `model_pricing.json`
2. Update the `lastUpdated` field
3. Increment the `version` if making significant changes
4. Restart your application or call `reloadPricingConfig()`

### **Example Update**
```json
{
  "version": "1.1.0",
  "lastUpdated": "2025-07-15",
  "pricing": {
    "gpt-4": {
      "input": 25.0,  // Updated from 30.0
      "output": 50.0, // Updated from 60.0
      "description": "GPT-4 Turbo with 128K context",
      "provider": "OpenAI"
    }
  }
}
```

### **Adding New Models**
```json
{
  "pricing": {
    "new-model": {
      "input": 5.0,
      "output": 15.0,
      "description": "New AI model",
      "provider": "NewProvider"
    }
  }
}
```

## 🗄️ **Future: Database Migration**

When ready to move to a database:

1. **Create pricing table**:
```sql
CREATE TABLE model_pricing (
  model_name VARCHAR(50) PRIMARY KEY,
  input_cost DECIMAL(10,4),
  output_cost DECIMAL(10,4),
  description TEXT,
  provider VARCHAR(50),
  last_updated TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

2. **Update TokenCalculator** to load from database instead of file
3. **Create admin interface** for updating prices
4. **Add versioning** and audit trails

## 📊 **Pricing Sources**

- **OpenAI**: https://openai.com/pricing
- **Anthropic**: https://www.anthropic.com/pricing
- **Google**: https://ai.google.dev/pricing
- **Meta**: Community pricing for open models

## 🔄 **Automation Ideas**

- **Webhook integration** with provider pricing APIs
- **Scheduled price checks** and alerts
- **Price change notifications** to users
- **Automatic cost optimization** based on new pricing 
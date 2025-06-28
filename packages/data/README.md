# Griot Node Data Package

## 🎯 **Overview**

This package contains the core data structures, skills, recipes, and adapters for the Griot Node. It follows a **modular, atomic design** where complex operations are broken down into focused, composable components.

## 🏗️ **Architecture Philosophy**

### **Human Skills vs Agent Skills**

**Human Skills** are complex, multi-step processes that require judgment, creativity, and adaptation:
- **Prompt Engineering** - Template management, optimization, A/B testing, analysis
- **Cooking** - Recipe following, ingredient preparation, timing, taste testing
- **Driving** - Navigation, traffic awareness, vehicle control, decision making

**Agent Skills** are atomic, single-purpose operations that can be composed into complex workflows:
- **Template Rendering** - Replace variables in a template
- **Text Similarity** - Calculate similarity between two texts
- **Variable Extraction** - Extract variables from text
- **JSON Parsing** - Parse JSON responses
- **Text Validation** - Validate text format/quality

### **The Atomic Approach**

Instead of monolithic skills that try to do everything, we break complex operations into focused, atomic skills that can be orchestrated by recipes:

```
Monolithic Approach (❌)
└── prompt_engineering.yaml (500+ lines, does everything)

Atomic Approach (✅)
├── template_rendering.yaml (50 lines, just renders templates)
├── prompt_optimization.yaml (100 lines, just optimizes prompts)
├── prompt_analysis.yaml (150 lines, just analyzes prompts)
└── comprehensive_prompt_engineering.yaml (recipe that orchestrates all three)
```

## 📁 **Package Structure**

```
packages/data/
├── skills/                    # Atomic operations
│   ├── ai/                   # AI/ML capabilities
│   │   ├── llm_integration.yaml
│   │   ├── prompt_optimization.yaml
│   │   ├── prompt_analysis.yaml
│   │   ├── template_rendering.yaml
│   │   ├── rag_operations.yaml
│   │   └── text_processing.yaml
│   ├── database/             # Database operations
│   │   ├── postgresql_operations.yaml
│   │   └── weaviate_operations.yaml
│   ├── api/                  # API communication
│   │   └── http_client.yaml
│   ├── security/             # Security operations
│   │   └── encryption.yaml
│   └── adapters/             # System translators
│       └── mongodb_postgresql.yaml
├── recipes/                  # Complex workflows
│   └── ai/
│       └── comprehensive_prompt_engineering.yaml
├── personas/                 # Agent personalities
├── schemas/                  # Data schemas
└── implementation-todo.md    # Development roadmap
```

## 🎯 **Design Principles**

### **Skill Design Principles**
- **Single Responsibility**: Each skill does one thing well
- **Atomic Operations**: Skills are composable building blocks
- **Focused Scope**: Skills are specific, not monolithic
- **Clear Interfaces**: Well-defined inputs/outputs
- **No Cultural Tags**: Skills are universal, not culturally specific

### **Recipe Design Principles**
- **Orchestration**: Recipes coordinate multiple skills
- **Workflow Logic**: Handle complex multi-step processes
- **Error Handling**: Robust error recovery and fallbacks
- **Conditional Logic**: Dynamic workflow paths

### **Adapter Design Principles**
- **Universal Translation**: Convert between different systems
- **Bidirectional**: Support translation in both directions
- **Schema Preservation**: Maintain data integrity during translation
- **Error Recovery**: Handle translation failures gracefully

## 🚀 **Usage Examples**

### **Using Atomic Skills Directly**

```typescript
// Use a single skill for a specific task
import { TemplateRendering } from './skills/ai/template_rendering.yaml';

const renderer = new TemplateRendering();
const result = renderer.render(
  "Hello {{name}}, welcome to {{platform}}!",
  { name: "Alice", platform: "Griot" }
);
// Result: "Hello Alice, welcome to Griot!"
```

### **Using Recipes for Complex Workflows**

```typescript
// Use a recipe for complex prompt engineering
import { ComprehensivePromptEngineering } from './recipes/ai/comprehensive_prompt_engineering.yaml';

const recipe = new ComprehensivePromptEngineering();
const result = await recipe.execute({
  original_prompt: "Write a story about a cat",
  optimization_target: "Create an engaging, detailed story with character development",
  enable_ab_testing: true,
  test_cases: [
    { input: "cat story", expectedOutput: "detailed narrative with character development" }
  ]
});
```

### **Using Adapters for System Translation**

```typescript
// Use an adapter to translate between systems
import { MongoDBPostgreSQLAdapter } from './adapters/mongodb_postgresql.yaml';

const adapter = new MongoDBPostgreSQLAdapter();
const postgresData = adapter.mongoToPostgres(mongoDocument);
```

## 🔄 **Migration from Monolithic Skills**

### **Before (Monolithic)**
```yaml
# prompt_engineering.yaml (500+ lines)
name: "Prompt Engineering"
description: "Complete prompt engineering system"
code: |
  class PromptEngineering {
    // Template management
    renderTemplate() { /* 50 lines */ }
    extractVariables() { /* 30 lines */ }
    validateTemplate() { /* 40 lines */ }
    
    // Optimization
    optimizePrompt() { /* 100 lines */ }
    testVariants() { /* 80 lines */ }
    iterativeOptimization() { /* 120 lines */ }
    
    // Analysis
    analyzePrompt() { /* 150 lines */ }
    calculateMetrics() { /* 60 lines */ }
    generateSuggestions() { /* 40 lines */ }
  }
```

### **After (Atomic)**
```yaml
# template_rendering.yaml (50 lines)
name: "Template Rendering"
description: "Render templates by replacing variables"
code: |
  class TemplateRendering {
    render() { /* 20 lines */ }
    extractVariables() { /* 15 lines */ }
    validateTemplate() { /* 15 lines */ }
  }

# prompt_optimization.yaml (100 lines)
name: "Prompt Optimization"
description: "Optimize prompts for better performance"
code: |
  class PromptOptimization {
    optimizePrompt() { /* 40 lines */ }
    testVariants() { /* 35 lines */ }
    iterativeOptimization() { /* 25 lines */ }
  }

# prompt_analysis.yaml (150 lines)
name: "Prompt Analysis"
description: "Analyze prompt quality and issues"
code: |
  class PromptAnalysis {
    analyzePrompt() { /* 60 lines */ }
    calculateMetrics() { /* 50 lines */ }
    generateSuggestions() { /* 40 lines */ }
  }

# comprehensive_prompt_engineering.yaml (recipe)
name: "Comprehensive Prompt Engineering"
workflow:
  steps:
    - step: 1
      skills:
        - skill: "prompt_analysis"
          action: "analyzePrompt"
    - step: 2
      skills:
        - skill: "template_rendering"
          action: "extractVariables"
    # ... more steps
```

## 🎉 **Benefits of Atomic Approach**

### **Maintainability**
- **Smaller Files**: Each skill is focused and easier to understand
- **Clear Boundaries**: No overlap between skills
- **Easier Testing**: Test individual components in isolation

### **Reusability**
- **Composable**: Mix and match skills for different workflows
- **Flexible**: Use skills independently or in recipes
- **Extensible**: Add new skills without affecting existing ones

### **Performance**
- **Focused Optimization**: Optimize each skill for its specific task
- **Selective Loading**: Only load the skills you need
- **Parallel Execution**: Run independent skills in parallel

### **Debugging**
- **Clear Error Sources**: Errors are isolated to specific skills
- **Easier Tracing**: Follow execution through individual skills
- **Better Logging**: Log at the skill level for better visibility

## 📋 **Development Guidelines**

### **Creating New Skills**
1. **Identify the atomic operation** - What single thing does this skill do?
2. **Define clear interfaces** - What inputs/outputs does it need?
3. **Keep it focused** - Resist the urge to add "just one more feature"
4. **Write comprehensive tests** - Test all edge cases
5. **Document thoroughly** - Clear examples and usage patterns

### **Creating New Recipes**
1. **Identify the workflow** - What complex process are you orchestrating?
2. **Break it into steps** - Each step should use 1-3 skills
3. **Handle errors gracefully** - What happens when skills fail?
4. **Add conditional logic** - When should steps be skipped?
5. **Test the workflow** - Test the entire recipe, not just individual skills

### **Creating New Adapters**
1. **Identify the systems** - What two systems need translation?
2. **Map the schemas** - How do data structures differ?
3. **Handle edge cases** - What about missing or invalid data?
4. **Test bidirectionally** - Test translation in both directions
5. **Preserve semantics** - Ensure meaning isn't lost in translation

## 🚀 **Next Steps**

See `implementation-todo.md` for the current development roadmap and priorities.

# 🧰 Recipe Box - Dynamic Skill Orchestration

The **Recipe Box** is the core orchestration engine that dynamically loads and executes skills to create complex workflows. Think of it as a smart kitchen where recipes (workflows) can automatically grab the right tools (skills) they need.

## 🎯 **Core Concept**

### **What is the Recipe Box?**
- **Dynamic Skill Loader**: Automatically discovers and loads skills at runtime
- **Workflow Orchestrator**: Executes multi-step recipes with conditional logic
- **Context Manager**: Maintains state and passes data between steps
- **Plugin Architecture**: Skills are pluggable and can be swapped dynamically

### **The Dining Experience Metaphor**
```
Recipe Box = Smart Kitchen
├── Recipes = Cooking instructions (workflows)
├── Skills = Kitchen tools (capabilities)
├── Courses = Sequential and parallel execution
├── Dining Experience = Complex multi-recipe orchestration
├── Ingredients = Input data
└── Dishes = Output results
```

## 🍽️ **Dining Experience Architecture**

### **Multi-Course Meals**
Just like a fine dining experience, recipes can be orchestrated into courses:

```yaml
# Sequential Courses (like a traditional meal)
Appetizer → Soup → Main Course → Dessert

# Parallel Preparation (like kitchen prep)
[Chef A: Soup] [Chef B: Salad] [Chef C: Bread]
     ↓              ↓              ↓
    All served together as First Course
```

### **Dining Experience Recipe**
```yaml
workflow:
  steps:
    - step: 1
      name: "Amuse-Bouche"
      parallel: false  # Sequential
      skills: [appetizer_skill]
    
    - step: 2
      name: "First Course"
      parallel: true   # Parallel execution
      skills: [soup_skill, salad_skill, bread_skill]
    
    - step: 3
      name: "Main Course"
      parallel: false  # Sequential refinement
      skills: [main_dish_skill, side_dish_skill]
    
    - step: 4
      name: "Dessert & Drinks"
      parallel: true   # Parallel finale
      skills: [dessert_skill, beverage_skill]
```

## 🏗️ **Architecture**

### **Dynamic Skill Loading**
```typescript
// Skills are loaded dynamically by name
await recipeBox.registerSkill('prompt_analysis', './skills/ai/prompt_analysis');
await recipeBox.registerSkill('template_rendering', './skills/ai/template_rendering');

// Recipes reference skills by name only
const recipe = {
  workflow: {
    steps: [
      {
        skills: [
          {
            skill: "prompt_analysis",  // ← Loaded dynamically
            action: "analyzePrompt",   // ← Method called
            input: { prompt: "{{original_prompt}}" },
            output: "analysis_result"
          }
        ]
      }
    ]
  }
};
```

### **Context Flow**
```
Input Data → Recipe Box → Skill 1 → Context Update → Skill 2 → Final Output
```

## 💰 **Cost Management & Token Optimization**

### **Token Calculator Skill**
- **Precise Token Counting**: Calculate exact token usage for any text
- **Cost Analysis**: Track costs across different models and operations
- **Budget Planning**: Estimate operations for given budgets
- **Efficiency Reporting**: Identify optimization opportunities

### **Cost Management Features**
```typescript
// Calculate costs for different models
const costs = tokenCalculator.compareModelCosts(input, output, [
  'gpt-4', 'gpt-3.5-turbo', 'claude-3-haiku'
]);

// Generate detailed cost reports
const report = tokenCalculator.generateReport(
  'content_creation',
  inputText,
  outputText,
  'gpt-4'
);

// Plan operations within budget
const plan = tokenCalculator.estimateOperationsForBudget(
  10.0, // $10 budget
  500,  // avg input length
  1000  // avg output length
);
```

## 📋 **Recipe Structure**

### **Basic Recipe**
```yaml
name: "Simple Prompt Engineering"
description: "Analyze and optimize a prompt"
workflow:
  steps:
    - step: 1
      name: "Analyze Prompt"
      parallel: false
      skills:
        - skill: "prompt_analysis"
          action: "analyzePrompt"
          input:
            prompt: "{{original_prompt}}"
          output: "analysis_result"
    
    - step: 2
      name: "Optimize if Needed"
      parallel: true
      condition: "analysis_result.score < 0.7"
      skills:
        - skill: "prompt_optimization"
          action: "optimizePrompt"
          input:
            prompt: "{{original_prompt}}"
          output: "optimized_prompt"
        - skill: "token_calculator"
          action: "generateReport"
          input:
            operation: "optimization"
            inputText: "{{original_prompt}}"
            outputText: "{{optimized_prompt}}"
          output: "cost_report"

inputs:
  original_prompt: "string"

outputs:
  final_prompt: "string"
  analysis_result: "object"
  cost_report: "object"
```

### **Advanced Features**
- **Conditional Execution**: Steps can be skipped based on conditions
- **Parallel Execution**: Multiple skills can run simultaneously
- **Variable Resolution**: `{{variable_name}}` syntax for dynamic values
- **Error Handling**: Graceful failure and recovery
- **Cost Tracking**: Automatic cost calculation and reporting

## 🔧 **Usage Examples**

### **Basic Usage**
```typescript
import { RecipeBox } from './core/recipe_box';

const recipeBox = new RecipeBox();

// Register skills
await recipeBox.registerSkill('prompt_analysis', './skills/ai/prompt_analysis');
await recipeBox.registerSkill('template_rendering', './skills/ai/template_rendering');
await recipeBox.registerSkill('token_calculator', './skills/ai/token_calculator');

// Execute recipe
const results = await recipeBox.executeRecipe(recipe, {
  original_prompt: "Write a story about a cat"
});

console.log(results.final_prompt);
console.log(results.cost_report);
```

### **Dining Experience**
```typescript
// Execute a complete dining experience
const diningResults = await recipeBox.executeRecipe(diningExperience, {
  appetizer_prompt: "Write a catchy headline",
  soup_prompt: "Create an introduction",
  salad_prompt: "List key points",
  main_dish_prompt: "Write comprehensive content",
  side_dish_prompt: "Add supporting data",
  dessert_prompt: "Create conclusion",
  beverage_prompt: "Suggest related topics",
  budget_limit: 5.0
});

console.log('Complete meal:', diningResults.complete_meal);
console.log('Total cost:', diningResults.total_cost);
console.log('Efficiency score:', diningResults.efficiency_score);
```

### **Runtime Skill Discovery**
```typescript
// Skills can be discovered and loaded at runtime
const availableSkills = await skillDiscovery.discoverSkills(requirements);

for (const skill of availableSkills) {
  await recipeBox.registerSkill(skill.name, skill.path);
}
```

### **Environment-Specific Loading**
```typescript
// Load different skills based on environment
if (process.env.NODE_ENV === 'production') {
  await recipeBox.registerSkill('llm', './skills/production/llm');
} else {
  await recipeBox.registerSkill('llm', './skills/development/llm');
}
```

## 🎛️ **Skill Interface**

### **Skill Structure**
```typescript
export class PromptAnalysis {
  constructor(config?: any) {
    // Initialize with optional configuration
  }
  
  async analyzePrompt(input: { prompt: string }): Promise<AnalysisResult> {
    // Core skill logic
    return {
      score: 0.85,
      issues: [],
      suggestions: []
    };
  }
  
  // Other methods...
}
```

### **Skill Registration**
```typescript
// Skills are registered by name and path
await recipeBox.registerSkill('prompt_analysis', './skills/ai/prompt_analysis');

// Skills can have configuration
await recipeBox.registerSkill('llm', './skills/ai/llm', {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4'
});
```

## 🚀 **Benefits**

### **1. Modularity**
- Skills are independent and testable
- Recipes are declarative and readable
- Easy to add new capabilities

### **2. Flexibility**
- Skills can be swapped at runtime
- Different environments can use different skills
- Conditional execution based on context

### **3. Efficiency**
- Parallel execution for better performance
- Token optimization for cost savings
- Cost tracking and budget management

### **4. Scalability**
- Skills can be distributed across services
- Recipes can orchestrate complex workflows
- Easy to add new skills and recipes

### **5. Cost Management**
- Precise token counting and cost calculation
- Budget planning and optimization
- Efficiency reporting and recommendations

## 🔮 **Future Enhancements**

### **Planned Features**
- **Parallel Execution**: Multiple skills running simultaneously
- **Skill Dependencies**: Skills that depend on other skills
- **Skill Versioning**: Multiple versions of the same skill
- **Skill Metrics**: Performance monitoring and optimization
- **Visual Recipe Builder**: GUI for creating recipes

### **Advanced Orchestration**
- **Recursive Recipes**: Recipes that call other recipes
- **Error Recovery**: Automatic retry and fallback mechanisms
- **Resource Management**: Memory and CPU optimization
- **Distributed Execution**: Skills running on different machines

### **Advanced Cost Management**
- **Real-time Cost Monitoring**: Live cost tracking during execution
- **Predictive Cost Modeling**: Estimate costs before execution
- **Cost Optimization Strategies**: Automatic model selection
- **Budget Enforcement**: Hard stops when budget exceeded

## 📚 **Related Concepts**

- **Microservices**: Skills as independent services
- **Plugin Architecture**: Skills as pluggable components
- **Workflow Engines**: Recipes as workflow definitions
- **Event Sourcing**: Context as event stream
- **CQRS**: Commands (skills) and Queries (recipes)
- **Fine Dining**: Multi-course orchestration
- **Kitchen Management**: Parallel and sequential execution

---

The Recipe Box transforms complex workflows into elegant dining experiences, where multiple recipes work together in harmony to create amazing results while keeping costs under control! 🎉 
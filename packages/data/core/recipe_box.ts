export interface SkillRegistry {
  [skillName: string]: {
    class: any;
    instance: any;
    config?: any;
  };
}

export interface RecipeStep {
  step: number;
  name: string;
  description?: string;
  skills: Array<{
    skill: string;
    action: string;
    input: Record<string, any>;
    output: string;
  }>;
  condition?: string;
}

export interface Recipe {
  name: string;
  description: string;
  workflow: {
    steps: RecipeStep[];
  };
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

export class RecipeBox {
  private skillRegistry: SkillRegistry = {};
  private context: Record<string, any> = {};
  
  // Register a skill dynamically
  async registerSkill(skillName: string, skillPath: string, config?: any): Promise<void> {
    try {
      // Dynamic import of the skill
      const skillModule = await import(skillPath);
      const SkillClass = skillModule.default || skillModule[Object.keys(skillModule)[0]];
      
      // Create instance
      const instance = new SkillClass(config);
      
      // Register in registry
      this.skillRegistry[skillName] = {
        class: SkillClass,
        instance,
        config,
      };
      
      console.log(`✅ Skill registered: ${skillName}`);
    } catch (error) {
      console.error(`❌ Failed to register skill ${skillName}:`, error);
      throw error;
    }
  }
  
  // Execute a recipe with dynamic skill loading
  async executeRecipe(recipe: Recipe, inputs: Record<string, any>): Promise<Record<string, any>> {
    console.log(`🚀 Executing recipe: ${recipe.name}`);
    
    // Initialize context with inputs
    this.context = { ...inputs };
    
    // Execute each step
    for (const step of recipe.workflow.steps) {
      console.log(`📋 Executing step ${step.step}: ${step.name}`);
      
      // Check condition if present
      if (step.condition && !this.evaluateCondition(step.condition)) {
        console.log(`⏭️ Skipping step ${step.step} (condition not met)`);
        continue;
      }
      
      // Execute each skill in the step
      for (const skillCall of step.skills) {
        await this.executeSkill(skillCall);
      }
    }
    
    // Return outputs
    const outputs: Record<string, any> = {};
    for (const [outputName, outputSpec] of Object.entries(recipe.outputs)) {
      if (this.context[outputName]) {
        outputs[outputName] = this.context[outputName];
      }
    }
    
    console.log(`✅ Recipe completed: ${recipe.name}`);
    return outputs;
  }
  
  // Execute a single skill dynamically
  private async executeSkill(skillCall: {
    skill: string;
    action: string;
    input: Record<string, any>;
    output: string;
  }): Promise<void> {
    const { skill: skillName, action, input, output } = skillCall;
    
    // Check if skill is registered
    if (!this.skillRegistry[skillName]) {
      throw new Error(`Skill not registered: ${skillName}`);
    }
    
    const skillInstance = this.skillRegistry[skillName].instance;
    
    // Check if method exists
    if (typeof skillInstance[action] !== 'function') {
      throw new Error(`Action ${action} not found in skill ${skillName}`);
    }
    
    // Resolve input variables from context
    const resolvedInput = this.resolveVariables(input);
    
    console.log(`🔧 Executing ${skillName}.${action}()`);
    
    try {
      // Execute the skill method
      const result = await skillInstance[action](resolvedInput);
      
      // Store result in context
      this.context[output] = result;
      
      console.log(`✅ ${skillName}.${action}() completed`);
    } catch (error) {
      console.error(`❌ Error in ${skillName}.${action}():`, error);
      throw error;
    }
  }
  
  // Resolve variables in input (e.g., {{variable_name}})
  private resolveVariables(input: Record<string, any>): Record<string, any> {
    const resolved: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string' && value.includes('{{')) {
        // Replace {{variable}} with context value
        resolved[key] = value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
          return this.context[varName] !== undefined ? this.context[varName] : match;
        });
      } else {
        resolved[key] = value;
      }
    }
    
    return resolved;
  }
  
  // Evaluate conditional expressions
  private evaluateCondition(condition: string): boolean {
    // Simple condition evaluation
    // In practice, you'd want a more robust expression parser
    
    if (condition.includes('===')) {
      const [left, right] = condition.split('===').map(s => s.trim());
      return this.context[left] === this.context[right];
    }
    
    if (condition.includes('<')) {
      const [left, right] = condition.split('<').map(s => s.trim());
      return this.context[left] < this.context[right];
    }
    
    if (condition.includes('>')) {
      const [left, right] = condition.split('>').map(s => s.trim());
      return this.context[left] > this.context[right];
    }
    
    // Default: check if variable exists and is truthy
    return Boolean(this.context[condition]);
  }
  
  // Get registered skills
  getRegisteredSkills(): string[] {
    return Object.keys(this.skillRegistry);
  }
  
  // Clear context
  clearContext(): void {
    this.context = {};
  }
} 
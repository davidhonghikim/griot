export class RecipeBox {
    constructor() {
        this.skillRegistry = {};
        this.context = {};
    }
    async registerSkill(skillName, skillPath, config) {
        try {
            const skillModule = await import(skillPath);
            const keys = Object.keys(skillModule);
            const SkillClass = skillModule.default || (keys.length > 0 && keys[0] !== undefined ? skillModule[keys[0]] : null);
            if (!SkillClass) {
                throw new Error(`No valid skill class found in module: ${skillPath}`);
            }
            const instance = new SkillClass(config);
            this.skillRegistry[skillName] = {
                class: SkillClass,
                instance,
                config,
            };
            console.log(`✅ Skill registered: ${skillName}`);
        }
        catch (error) {
            console.error(`❌ Failed to register skill ${skillName}:`, error);
            throw error;
        }
    }
    async executeRecipe(recipe, inputs) {
        console.log(`🚀 Executing recipe: ${recipe.name}`);
        this.context = { ...inputs };
        for (const step of recipe.workflow.steps) {
            console.log(`📋 Executing step ${step.step}: ${step.name}`);
            if (step.condition && !this.evaluateCondition(step.condition)) {
                console.log(`⏭️ Skipping step ${step.step} (condition not met)`);
                continue;
            }
            for (const skillCall of step.skills) {
                await this.executeSkill(skillCall);
            }
        }
        const outputs = {};
        for (const [outputName, outputSpec] of Object.entries(recipe.outputs)) {
            if (this.context[outputName]) {
                outputs[outputName] = this.context[outputName];
            }
        }
        console.log(`✅ Recipe completed: ${recipe.name}`);
        return outputs;
    }
    async executeSkill(skillCall) {
        const { skill: skillName, action, input, output } = skillCall;
        if (!this.skillRegistry[skillName]) {
            throw new Error(`Skill not registered: ${skillName}`);
        }
        const skillInstance = this.skillRegistry[skillName].instance;
        if (typeof skillInstance[action] !== 'function') {
            throw new Error(`Action ${action} not found in skill ${skillName}`);
        }
        const resolvedInput = this.resolveVariables(input);
        console.log(`🔧 Executing ${skillName}.${action}()`);
        try {
            const result = await skillInstance[action](resolvedInput);
            this.context[output] = result;
            console.log(`✅ ${skillName}.${action}() completed`);
        }
        catch (error) {
            console.error(`❌ Error in ${skillName}.${action}():`, error);
            throw error;
        }
    }
    resolveVariables(input) {
        const resolved = {};
        for (const [key, value] of Object.entries(input)) {
            if (typeof value === 'string' && value.includes('{{')) {
                resolved[key] = value.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
                    return this.context[varName] !== undefined ? this.context[varName] : match;
                });
            }
            else {
                resolved[key] = value;
            }
        }
        return resolved;
    }
    evaluateCondition(condition) {
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
        return Boolean(this.context[condition]);
    }
    getRegisteredSkills() {
        return Object.keys(this.skillRegistry);
    }
    clearContext() {
        this.context = {};
    }
}
//# sourceMappingURL=recipe_box.js.map
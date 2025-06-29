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
export declare class RecipeBox {
    private skillRegistry;
    private context;
    registerSkill(skillName: string, skillPath: string, config?: any): Promise<void>;
    executeRecipe(recipe: Recipe, inputs: Record<string, any>): Promise<Record<string, any>>;
    private executeSkill;
    private resolveVariables;
    private evaluateCondition;
    getRegisteredSkills(): string[];
    clearContext(): void;
}
//# sourceMappingURL=recipe_box.d.ts.map
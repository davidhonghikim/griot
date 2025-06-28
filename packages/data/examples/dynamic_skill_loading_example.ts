import { RecipeBox } from '../core/recipe_box';

// Example: How a recipe dynamically loads and uses skills

async function demonstrateDynamicSkillLoading() {
  const recipeBox = new RecipeBox();
  
  // 1. Register skills dynamically
  console.log('📚 Registering skills...');
  await recipeBox.registerSkill('prompt_analysis', '../skills/ai/prompt_analysis');
  await recipeBox.registerSkill('template_rendering', '../skills/ai/template_rendering');
  await recipeBox.registerSkill('prompt_optimization', '../skills/ai/prompt_optimization');
  
  console.log('Registered skills:', recipeBox.getRegisteredSkills());
  
  // 2. Define a simple recipe that uses these skills
  const simplePromptRecipe = {
    name: "Simple Prompt Engineering",
    description: "Basic prompt analysis and optimization",
    workflow: {
      steps: [
        {
          step: 1,
          name: "Analyze Original Prompt",
          skills: [
            {
              skill: "prompt_analysis",  // ← Dynamically loads this skill
              action: "analyzePrompt",   // ← Calls this method
              input: {
                prompt: "{{original_prompt}}"  // ← Variable from context
              },
              output: "analysis_result"
            }
          ]
        },
        {
          step: 2,
          name: "Optimize if Needed",
          condition: "analysis_result.score < 0.7",  // ← Conditional execution
          skills: [
            {
              skill: "prompt_optimization",  // ← Dynamically loads this skill
              action: "optimizePrompt",      // ← Calls this method
              input: {
                prompt: "{{original_prompt}}",
                target: "{{optimization_target}}"
              },
              output: "optimized_prompt"
            }
          ]
        },
        {
          step: 3,
          name: "Render Template",
          condition: "template_variables.length > 0",
          skills: [
            {
              skill: "template_rendering",  // ← Dynamically loads this skill
              action: "render",             // ← Calls this method
              input: {
                template: "{{final_prompt}}",
                variables: "{{provided_variables}}"
              },
              output: "rendered_prompt"
            }
          ]
        }
      ]
    },
    inputs: {
      original_prompt: "string",
      optimization_target: "string",
      provided_variables: "object"
    },
    outputs: {
      final_prompt: "string",
      analysis_result: "object"
    }
  };
  
  // 3. Execute the recipe with inputs
  console.log('\n🚀 Executing recipe...');
  const results = await recipeBox.executeRecipe(simplePromptRecipe, {
    original_prompt: "Write a story about a cat",
    optimization_target: "Create an engaging story with character development",
    provided_variables: {
      character_name: "Whiskers",
      setting: "a cozy apartment"
    }
  });
  
  console.log('\n📊 Recipe Results:');
  console.log('Final Prompt:', results.final_prompt);
  console.log('Analysis:', results.analysis_result);
}

// Example: Runtime skill discovery and loading
async function demonstrateRuntimeSkillDiscovery() {
  const recipeBox = new RecipeBox();
  
  // 1. Discover available skills at runtime
  const skillDiscovery = {
    name: "Dynamic Skill Discovery",
    description: "Discover and load skills based on requirements",
    workflow: {
      steps: [
        {
          step: 1,
          name: "Load Required Skills",
          skills: [
            {
              skill: "skill_discovery",  // ← This skill discovers other skills
              action: "discoverSkills",
              input: {
                requirements: "{{skill_requirements}}"
              },
              output: "available_skills"
            }
          ]
        },
        {
          step: 2,
          name: "Register Discovered Skills",
          skills: [
            {
              skill: "skill_loader",  // ← This skill loads discovered skills
              action: "loadSkills",
              input: {
                skills: "{{available_skills}}"
              },
              output: "loaded_skills"
            }
          ]
        }
      ]
    },
    inputs: {
      skill_requirements: "array"
    },
    outputs: {
      loaded_skills: "array"
    }
  };
  
  // 2. Execute with dynamic requirements
  const results = await recipeBox.executeRecipe(skillDiscovery, {
    skill_requirements: [
      "text_processing",
      "database_operations", 
      "api_communication"
    ]
  });
  
  console.log('Dynamically loaded skills:', results.loaded_skills);
}

// Example: Conditional skill loading based on environment
async function demonstrateConditionalSkillLoading() {
  const recipeBox = new RecipeBox();
  
  const adaptiveRecipe = {
    name: "Adaptive Skill Loading",
    description: "Load different skills based on environment",
    workflow: {
      steps: [
        {
          step: 1,
          name: "Environment Detection",
          skills: [
            {
              skill: "environment_detector",
              action: "detectEnvironment",
              input: {},
              output: "environment_info"
            }
          ]
        },
        {
          step: 2,
          name: "Load Production Skills",
          condition: "environment_info.environment === 'production'",
          skills: [
            {
              skill: "skill_loader",
              action: "loadProductionSkills",
              input: {},
              output: "production_skills"
            }
          ]
        },
        {
          step: 3,
          name: "Load Development Skills",
          condition: "environment_info.environment === 'development'",
          skills: [
            {
              skill: "skill_loader",
              action: "loadDevelopmentSkills",
              input: {},
              output: "development_skills"
            }
          ]
        }
      ]
    },
    inputs: {},
    outputs: {
      loaded_skills: "array"
    }
  };
  
  // This would load different skills based on the detected environment
  const results = await recipeBox.executeRecipe(adaptiveRecipe, {});
  console.log('Environment-appropriate skills loaded:', results.loaded_skills);
}

// Run the examples
if (require.main === module) {
  demonstrateDynamicSkillLoading()
    .then(() => demonstrateRuntimeSkillDiscovery())
    .then(() => demonstrateConditionalSkillLoading())
    .catch(console.error);
}

export {
  demonstrateDynamicSkillLoading,
  demonstrateRuntimeSkillDiscovery,
  demonstrateConditionalSkillLoading
}; 
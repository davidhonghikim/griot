#!/usr/bin/env node

/**
 * Implementation Plan Creator
 * 
 * Creates new implementation plans using templates and validates against schema.
 */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Ajv = require('ajv');

class ImplementationPlanCreator {
  constructor() {
    this.baseDir = path.dirname(__dirname);
    this.templatesDir = path.join(this.baseDir, 'templates');
    this.activeDir = path.join(this.baseDir, 'active');
    this.configDir = path.join(this.baseDir, 'config');
    
    this.ajv = new Ajv();
    this.schema = null;
  }

  async initialize() {
    try {
      // Load schema
      const schemaPath = path.join(this.configDir, 'plan-schema.json');
      const schemaData = await fs.readFile(schemaPath, 'utf8');
      this.schema = JSON.parse(schemaData);
      this.ajv.addSchema(this.schema, 'plan-schema');
      
      console.log(chalk.green('✅ Implementation Plan Creator initialized'));
    } catch (error) {
      console.error(chalk.red('Failed to initialize:', error.message));
      throw error;
    }
  }

  async createPlan(options = {}) {
    console.log(chalk.blue.bold('\n📋 Creating New Implementation Plan'));
    
    // Get plan details
    const planDetails = await this.getPlanDetails(options);
    
    // Generate plan ID
    const planId = this.generatePlanId(planDetails.title);
    
    // Load template
    const template = await this.loadTemplate(options.template || 'plan-template.md');
    
    // Fill template
    const planContent = this.fillTemplate(template, {
      ...planDetails,
      plan_id: planId,
      date: new Date().toISOString().split('T')[0],
      agent_name: process.env.AGENT_NAME || 'agent:claude-sonnet-4'
    });
    
    // Create plan object
    const planObject = this.createPlanObject(planId, planDetails);
    
    // Validate plan
    const isValid = this.validatePlan(planObject);
    if (!isValid) {
      console.error(chalk.red('❌ Plan validation failed'));
      return null;
    }
    
    // Save plan
    const filename = options.output || `${planId}.md`;
    const filepath = path.join(this.activeDir, filename);
    
    await fs.writeFile(filepath, planContent);
    
    // Save JSON version
    const jsonPath = path.join(this.activeDir, `${planId}.json`);
    await fs.writeFile(jsonPath, JSON.stringify(planObject, null, 2));
    
    console.log(chalk.green(`✅ Plan created successfully!`));
    console.log(chalk.blue(`   Markdown: ${filepath}`));
    console.log(chalk.blue(`   JSON: ${jsonPath}`));
    
    return {
      id: planId,
      filepath: filepath,
      jsonPath: jsonPath,
      plan: planObject
    };
  }

  async getPlanDetails(options = {}) {
    const questions = [
      {
        type: 'input',
        name: 'title',
        message: 'Plan title:',
        default: options.title,
        validate: (input) => {
          if (!input || input.trim().length === 0) {
            return 'Title is required';
          }
          if (input.length > 200) {
            return 'Title must be less than 200 characters';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Plan description:',
        default: options.description,
        validate: (input) => {
          if (!input || input.trim().length < 10) {
            return 'Description must be at least 10 characters';
          }
          if (input.length > 1000) {
            return 'Description must be less than 1000 characters';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'priority',
        message: 'Priority level:',
        choices: [
          { name: 'Critical', value: 'critical' },
          { name: 'High', value: 'high' },
          { name: 'Medium', value: 'medium' },
          { name: 'Low', value: 'low' }
        ],
        default: options.priority || 'medium'
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma-separated):',
        default: options.tags || '',
        filter: (input) => {
          return input.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      },
      {
        type: 'confirm',
        name: 'addPhases',
        message: 'Would you like to add phases now?',
        default: true
      }
    ];

    const answers = await inquirer.prompt(questions);
    
    if (answers.addPhases) {
      answers.phases = await this.getPhases();
    } else {
      answers.phases = [];
    }

    return answers;
  }

  async getPhases() {
    const phases = [];
    let phaseNumber = 1;
    
    while (true) {
      console.log(chalk.blue(`\n📊 Phase ${phaseNumber}`));
      
      const phaseDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Phase title:',
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'Phase title is required';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'Phase description:',
          validate: (input) => {
            if (!input || input.trim().length < 10) {
              return 'Phase description must be at least 10 characters';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'startDate',
          message: 'Start date (YYYY-MM-DD):',
          default: new Date().toISOString().split('T')[0],
          validate: (input) => {
            const date = new Date(input);
            return !isNaN(date.getTime()) ? true : 'Invalid date format';
          }
        },
        {
          type: 'input',
          name: 'endDate',
          message: 'End date (YYYY-MM-DD):',
          validate: (input) => {
            const date = new Date(input);
            return !isNaN(date.getTime()) ? true : 'Invalid date format';
          }
        },
        {
          type: 'confirm',
          name: 'addMilestones',
          message: 'Add milestones to this phase?',
          default: true
        },
        {
          type: 'confirm',
          name: 'addTasks',
          message: 'Add tasks to this phase?',
          default: true
        }
      ]);

      const phase = {
        id: `phase_${phaseNumber}_${this.slugify(phaseDetails.title)}`,
        title: phaseDetails.title,
        description: phaseDetails.description,
        status: 'not_started',
        completion: 0,
        start_date: phaseDetails.startDate,
        end_date: phaseDetails.endDate,
        milestones: [],
        tasks: []
      };

      if (phaseDetails.addMilestones) {
        phase.milestones = await this.getMilestones(phaseNumber);
      }

      if (phaseDetails.addTasks) {
        phase.tasks = await this.getTasks(phaseNumber);
      }

      phases.push(phase);

      const { addAnother } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'Add another phase?',
          default: false
        }
      ]);

      if (!addAnother) break;
      phaseNumber++;
    }

    return phases;
  }

  async getMilestones(phaseNumber) {
    const milestones = [];
    let milestoneNumber = 1;
    
    while (true) {
      console.log(chalk.blue(`\n🎯 Phase ${phaseNumber} - Milestone ${milestoneNumber}`));
      
      const milestoneDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Milestone title:',
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'Milestone title is required';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'Milestone description:',
          validate: (input) => {
            if (!input || input.trim().length < 10) {
              return 'Milestone description must be at least 10 characters';
            }
            return true;
          }
        }
      ]);

      milestones.push({
        id: `milestone_${phaseNumber}_${milestoneNumber}`,
        title: milestoneDetails.title,
        description: milestoneDetails.description,
        status: 'not_started'
      });

      const { addAnother } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'Add another milestone?',
          default: false
        }
      ]);

      if (!addAnother) break;
      milestoneNumber++;
    }

    return milestones;
  }

  async getTasks(phaseNumber) {
    const tasks = [];
    let taskNumber = 1;
    
    while (true) {
      console.log(chalk.blue(`\n📝 Phase ${phaseNumber} - Task ${taskNumber}`));
      
      const taskDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Task title:',
          validate: (input) => {
            if (!input || input.trim().length === 0) {
              return 'Task title is required';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'description',
          message: 'Task description:',
          validate: (input) => {
            if (!input || input.trim().length < 10) {
              return 'Task description must be at least 10 characters';
            }
            return true;
          }
        },
        {
          type: 'input',
          name: 'assignee',
          message: 'Assignee:',
          default: 'agent:claude-sonnet-4'
        },
        {
          type: 'number',
          name: 'estimatedHours',
          message: 'Estimated hours:',
          default: 2,
          validate: (input) => {
            return input > 0 ? true : 'Estimated hours must be greater than 0';
          }
        }
      ]);

      tasks.push({
        id: `task_${phaseNumber}_${taskNumber}_1`,
        title: taskDetails.title,
        description: taskDetails.description,
        status: 'not_started',
        assignee: taskDetails.assignee,
        estimated_hours: taskDetails.estimatedHours
      });

      const { addAnother } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'Add another task?',
          default: false
        }
      ]);

      if (!addAnother) break;
      taskNumber++;
    }

    return tasks;
  }

  generatePlanId(title) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const slug = this.slugify(title);
    return `plan_${year}_${month}_${slug}`;
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  async loadTemplate(templateName) {
    const templatePath = path.join(this.templatesDir, templateName);
    try {
      return await fs.readFile(templatePath, 'utf8');
    } catch (error) {
      throw new Error(`Template not found: ${templateName}`);
    }
  }

  fillTemplate(template, data) {
    let content = template;
    
    // Replace placeholders
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `[${key.toUpperCase()}]`;
      if (typeof value === 'string') {
        content = content.replace(new RegExp(placeholder, 'g'), value);
      } else if (Array.isArray(value)) {
        content = content.replace(new RegExp(placeholder, 'g'), value.join(', '));
      }
    });
    
    return content;
  }

  createPlanObject(planId, details) {
    const now = new Date().toISOString();
    
    return {
      id: planId,
      title: details.title,
      description: details.description,
      status: 'active',
      priority: details.priority,
      phases: details.phases || [],
      metrics: {
        overall_completion: 0,
        phases_completed: 0,
        total_tasks: this.countTasks(details.phases),
        completed_tasks: 0,
        blocked_tasks: 0,
        resource_utilization: 0
      },
      dependencies: [],
      risks: [],
      metadata: {
        created: now,
        updated: now,
        created_by: process.env.AGENT_NAME || 'agent:claude-sonnet-4',
        version: '1.0.0',
        tags: details.tags || []
      }
    };
  }

  countTasks(phases) {
    return phases.reduce((total, phase) => {
      return total + (phase.tasks ? phase.tasks.length : 0);
    }, 0);
  }

  validatePlan(plan) {
    const validate = this.ajv.getSchema('plan-schema');
    const isValid = validate(plan);
    
    if (!isValid) {
      console.error(chalk.red('Validation errors:'));
      validate.errors.forEach(error => {
        console.error(chalk.red(`  - ${error.instancePath}: ${error.message}`));
      });
      return false;
    }
    
    return true;
  }
}

// CLI interface
async function main() {
  const creator = new ImplementationPlanCreator();
  
  try {
    await creator.initialize();
    
    const result = await creator.createPlan();
    
    if (result) {
      console.log(chalk.green('\n🎉 Implementation plan created successfully!'));
      console.log(chalk.blue(`Plan ID: ${result.id}`));
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to create plan:', error.message));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ImplementationPlanCreator; 
/**
 * Starseed Node Client SDK
 * Version: 2.0.0
 *
 * This SDK provides a type-safe client for interacting with the Starseed Node API.
 * It supports service orchestration, persona management, recipe execution, and database operations.
 */

// #region ############# TYPE DEFINITIONS #############

/**
 * Standardized error structure for all API responses.
 */
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
}

/**
 * Service instance information.
 */
export interface ServiceInstance {
  id: string;
  service: {
    type: string;
    name: string;
    defaultPort: number;
    protocols: string[];
    category: string;
  };
  host: string;
  port: number;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  lastTested: string;
  connectionResult?: {
    success: boolean;
    latency?: number;
    error?: string;
  };
}

/**
 * Service connection statistics.
 */
export interface ServiceStats {
  total: number;
  connected: number;
  disconnected: number;
  error: number;
  cacheStats: {
    size: number;
    entries: Array<{ key: string; protocol: 'http' | 'https' }>;
  };
}

/**
 * Database status information.
 */
export interface DatabaseStatus {
  connected: boolean;
  mongodb: {
    connected: boolean;
    readyState: number;
  };
  postgresql: {
    connected: boolean;
  };
  weaviate: {
    connected: boolean;
  };
  neo4j: {
    connected: boolean;
  };
}

/**
 * Skill definition from the Persona Forge.
 */
export interface Skill {
  _id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  parameters: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Persona definition from the Persona Forge.
 */
export interface Persona {
  _id: string;
  name: string;
  description: string;
  systemPrompt: string;
  skills: string[] | Skill[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Recipe definition for workflow execution.
 */
export interface Recipe {
  _id: string;
  name: string;
  description: string;
  version: string;
  trigger_phrases: string[];
  steps: Array<{
    skill: string;
    input: Record<string, any>;
    conditions?: Record<string, any>;
  }>;
  dependencies: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Recipe execution result.
 */
export interface RecipeExecution {
  executionId: string;
  recipeId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: Array<{
    stepId: string;
    skill: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    input: Record<string, any>;
    output?: any;
    error?: string;
    duration?: number;
  }>;
  result?: any;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

/**
 * Node information for KLF compatibility.
 */
export interface NodeInfo {
  id: string;
  name: string;
  type: string;
  version: string;
  status: string;
  capabilities: string[];
}

/**
 * System health information.
 */
export interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  database: DatabaseStatus;
  services: ServiceStats;
}

// #endregion

// #region ############# SDK CLIENT #############

export interface StarseedClientOptions {
  /** The base URL of the Starseed Node. e.g., http://localhost:30437 */
  baseUrl: string;
  /** Optional API key for authentication. */
  apiKey?: string;
  /** Request timeout in milliseconds. */
  timeout?: number;
}

export class StarseedClient {
  private baseUrl: string;
  private apiKey: string | null;
  private timeout: number;

  constructor(options: StarseedClientOptions) {
    // Ensure baseUrl does not end with a slash
    this.baseUrl = options.baseUrl.endsWith('/')
      ? options.baseUrl.slice(0, -1)
      : options.baseUrl;
    this.apiKey = options.apiKey || null;
    this.timeout = options.timeout || 30000;
  }

  /**
   * Performs a raw fetch request against the Starseed Node API.
   * @private
   */
  private async _fetch<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, { 
        ...options, 
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) { // No Content
        return null as T;
      }

      return response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  // #region --- System & Health ---

  /**
   * Get system health status.
   */
  public async getHealth(): Promise<HealthStatus> {
    return this._fetch<HealthStatus>('/health');
  }

  /**
   * Get node information for KLF compatibility.
   */
  public async getNodes(): Promise<{ nodes: NodeInfo[] }> {
    return this._fetch<{ nodes: NodeInfo[] }>('/api/nodes');
  }

  /**
   * Get database status.
   */
  public async getDatabaseStatus(): Promise<DatabaseStatus> {
    return this._fetch<DatabaseStatus>('/api/database/status');
  }

  // #endregion

  // #region --- Service Management ---

  /**
   * Service management operations.
   */
  public services = {
    /**
     * Get all registered service instances.
     */
    list: (): Promise<{ services: ServiceInstance[]; stats: ServiceStats }> => {
      return this._fetch<{ services: ServiceInstance[]; stats: ServiceStats }>('/api/services');
    },

    /**
     * Register a new service instance.
     */
    register: (serviceType: string, host?: string, port?: number, instanceId?: string): Promise<ServiceInstance> => {
      return this._fetch<ServiceInstance>('/api/services', {
        method: 'POST',
        body: JSON.stringify({ serviceType, host, port, instanceId })
      });
    },

    /**
     * Get a specific service instance.
     */
    get: (id: string): Promise<ServiceInstance> => {
      return this._fetch<ServiceInstance>(`/api/services/${id}`);
    },

    /**
     * Test a service connection.
     */
    test: (id: string): Promise<{ success: boolean; latency?: number; error?: string }> => {
      return this._fetch<{ success: boolean; latency?: number; error?: string }>(`/api/services/${id}/test`, {
        method: 'POST'
      });
    },

    /**
     * Remove a service instance.
     */
    remove: (id: string): Promise<{ message: string }> => {
      return this._fetch<{ message: string }>(`/api/services/${id}`, {
        method: 'DELETE'
      });
    },

    /**
     * Test all service connections.
     */
    testAll: (): Promise<{ results: Array<{ id: string; success: boolean; latency?: number; error?: string }>; stats: ServiceStats }> => {
      return this._fetch<{ results: Array<{ id: string; success: boolean; latency?: number; error?: string }>; stats: ServiceStats }>('/api/services/test-all', {
        method: 'POST'
      });
    },

    /**
     * Get services by category.
     */
    getByCategory: (category: string): Promise<{ category: string; services: any[] }> => {
      return this._fetch<{ category: string; services: any[] }>(`/api/services/categories/${category}`);
    },

    /**
     * Get available service types.
     */
    getTypes: (): Promise<{ types: string[] }> => {
      return this._fetch<{ types: string[] }>('/api/service-types');
    }
  };

  // #endregion

  // #region --- Persona Forge ---

  /**
   * Persona Forge operations.
   */
  public forge = {
    /**
     * Import skills and personas from YAML files to database.
     */
    import: (): Promise<{ status: string; imported_skills: number; imported_personas: number }> => {
      return this._fetch<{ status: string; imported_skills: number; imported_personas: number }>('/api/forge/import', {
        method: 'POST'
      });
    },

    /**
     * Get all skills.
     */
    getSkills: (): Promise<{ skills: Skill[] }> => {
      return this._fetch<{ skills: Skill[] }>('/api/skills');
    },

    /**
     * Create a new skill.
     */
    createSkill: (skillData: Omit<Skill, '_id' | 'createdAt' | 'updatedAt'>): Promise<Skill> => {
      return this._fetch<Skill>('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skillData)
      });
    },

    /**
     * Get all personas.
     */
    getPersonas: (): Promise<{ personas: Persona[] }> => {
      return this._fetch<{ personas: Persona[] }>('/api/personas');
    },

    /**
     * Get a specific persona with composed skills.
     */
    getPersona: (id: string): Promise<Persona> => {
      return this._fetch<Persona>(`/api/personas/${id}`);
    },

    /**
     * Update a persona (live edit).
     */
    updatePersona: (id: string, updates: Partial<Omit<Persona, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Persona> => {
      return this._fetch<Persona>(`/api/personas/${id}/live`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    /**
     * Export a persona to file system.
     */
    exportPersona: (id: string): Promise<{ status: string; path: string }> => {
      return this._fetch<{ status: string; path: string }>(`/api/personas/${id}/export`, {
        method: 'POST'
      });
    }
  };

  // #endregion

  // #region --- Recipe System ---

  /**
   * Recipe management operations.
   */
  public recipes = {
    /**
     * Get all recipes.
     */
    list: (): Promise<{ recipes: Recipe[] }> => {
      return this._fetch<{ recipes: Recipe[] }>('/api/recipes');
    },

    /**
     * Create a new recipe.
     */
    create: (recipeData: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
      return this._fetch<Recipe>('/api/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData)
      });
    },

    /**
     * Get a specific recipe.
     */
    get: (id: string): Promise<Recipe> => {
      return this._fetch<Recipe>(`/api/recipes/${id}`);
    },

    /**
     * Update a recipe.
     */
    update: (id: string, updates: Partial<Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Recipe> => {
      return this._fetch<Recipe>(`/api/recipes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    /**
     * Delete a recipe.
     */
    delete: (id: string): Promise<{ message: string }> => {
      return this._fetch<{ message: string }>(`/api/recipes/${id}`, {
        method: 'DELETE'
      });
    },

    /**
     * Execute a recipe.
     */
    execute: (id: string, inputs?: Record<string, any>): Promise<RecipeExecution> => {
      return this._fetch<RecipeExecution>(`/api/recipes/${id}/execute`, {
        method: 'POST',
        body: JSON.stringify({ inputs })
      });
    },

    /**
     * Get recipe execution status.
     */
    getExecution: (executionId: string): Promise<RecipeExecution> => {
      return this._fetch<RecipeExecution>(`/api/recipes/executions/${executionId}`);
    }
  };

  // #endregion

  // #region --- Authentication ---

  /**
   * Set API key for authentication.
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Clear API key.
   */
  public clearApiKey(): void {
    this.apiKey = null;
  }

  /**
   * Set request timeout.
   */
  public setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  // #endregion
}

// Export the client as default
export default StarseedClient; 
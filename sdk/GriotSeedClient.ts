/**
 * Griot Seed Protocol Client
 * Version: 1.1.0
 *
 * This SDK provides a type-safe client for interacting with the Griot Seed Protocol V1.
 * It is a client-facing API for a Griot node's services.
 *
 * @see /documentation/future/protocols/01_Griot_Seed_Protocol.md
 */

// #region ############# TYPE DEFINITIONS #############
// These types are directly derived from the protocol specification.

/**
 * Standardized error structure for all API responses.
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId: string;
  };
}

/**
 * Defines the structure for a service configuration.
 * The `apiKey` is never exposed to the client.
 */
export interface Service {
  id: string;
  name: string;
  type: 'ollama' | 'openai' | 'comfyui' | 'custom';
  url: string;
  capabilities: ('llm_chat' | 'llm_embedding' | 'image_generation')[];
  metadata: {
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Defines the structure for a long-running job.
 */
export interface Job {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: {
    code: string;
    message: string;
  };
  metadata: {
    createdAt: string;
    completedAt?: string;
  };
}

/**
 * Response from the /identity endpoint.
 */
export interface NodeIdentity {
    class: string;
    version: string;
    nodeId: string;
}

export type ServiceListResponse = {
  data: Service[];
}

export type JobListResponse = {
  data: Job[];
}

// #endregion

// #region ############# SDK CLIENT #############

export interface GriotSeedClientOptions {
  /** The base URL of the Griot node. e.g., http://localhost:30437 */
  baseUrl: string;
  /** Optional initial token for authentication. */
  token?: string;
}

export class GriotSeedClient {
  private baseUrl: string;
  private token: string | null;

  constructor(options: GriotSeedClientOptions) {
    // Ensure baseUrl does not end with a slash
    this.baseUrl = options.baseUrl.endsWith('/')
      ? options.baseUrl.slice(0, -1)
      : options.baseUrl;
    this.token = options.token || null;
  }

  /**
   * Performs a raw fetch request against the Griot API, handling auth and errors.
   * @private
   */
  private async _fetch<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/v1${path}`;
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      console.error('Griot API Error:', errorData);
      throw new Error(`[${errorData.error.code}] ${errorData.error.message}`);
    }

    if (response.status === 204) { // No Content
        return null as T;
    }

    return response.json() as T;
  }

  // #region --- Node and Auth ---

  /**
   * Retrieves the identity of the node to confirm it's a Griot.
   */
  public async getIdentity(): Promise<NodeIdentity> {
      return this._fetch<NodeIdentity>('/identity');
  }

  /**
   * Authenticates with the Griot node.
   * The returned token is automatically stored in the client for subsequent requests.
   */
  public async login(username: string, password: string):Promise<void> {
    const response = await this._fetch<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.token = response.accessToken;
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
  }

  // #endregion

  // #region --- Service Management ---

  public services = {
    /**
     * Retrieves a list of all configured services.
     */
    list: (): Promise<ServiceListResponse> => {
      return this._fetch<ServiceListResponse>('/services');
    },

    /**
     * Creates a new service configuration.
     */
    create: (serviceData: Omit<Service, 'id' | 'metadata'>): Promise<Service> => {
        return this._fetch<Service>('/services', {
            method: 'POST',
            body: JSON.stringify(serviceData)
        });
    },

    /**
     * Updates an existing service configuration.
     */
    update: (serviceId: string, updates: Partial<Omit<Service, 'id' | 'metadata'>>): Promise<Service> => {
        return this._fetch<Service>(`/services/${serviceId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    },

    /**
     * Deletes a service configuration.
     */
    delete: (serviceId: string): Promise<void> => {
        return this._fetch<void>(`/services/${serviceId}`, {
            method: 'DELETE'
        });
    }
  };

  // #endregion

  // #region --- Proxy & Jobs ---

  public jobs = {
    /**
     * Retrieves a list of all jobs.
     */
    list: (): Promise<JobListResponse> => {
      return this._fetch<JobListResponse>('/jobs');
    },

    /**
     * Creates a new job.
     */
    create: (jobData: { type: string; parameters: any; metadata?: any }): Promise<Job> => {
      return this._fetch<Job>('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
      });
    },

    /**
     * Polls the status of a long-running job.
     * @param jobId - The ID of the job to check.
     */
    getStatus: (jobId: string): Promise<Job> => {
      return this._fetch<Job>(`/jobs/${jobId}`);
    },

    /**
     * Deletes/cancels a job.
     */
    delete: (jobId: string): Promise<void> => {
      return this._fetch<void>(`/jobs/${jobId}`, {
        method: 'DELETE'
      });
    }
  }

  public proxy = {
    /**
     * Proxies a POST request to a backend service through the Griot node.
     * @param serviceId - The ID of the target service.
     * @param path - The specific API path on the backend service (e.g., '/chat').
     * @param body - The request body to be forwarded to the service.
     */
    post: <T>(serviceId: string, path: string, body: unknown): Promise<T> => {
      const fullPath = path.startsWith('/') ? path : `/${path}`;
      return this._fetch<T>(`/proxy/${serviceId}${fullPath}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    }
  }

  // #endregion
} 
/**
 * MongoDB Health Capability
 * 
 * Defines health check endpoints for MongoDB service.
 */

import type { HealthCapability } from '../../types';

export const healthCapability: HealthCapability = {
  capability: 'health',
  endpoints: {
    health: { path: '/admin/ping', method: 'GET' }
  }
}; 
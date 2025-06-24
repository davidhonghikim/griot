import { GriotSeedClient } from 'griot-sdk';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8003';

export const api = new GriotSeedClient({ baseUrl }); 
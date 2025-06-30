// API Client
const api = {
  baseURL: '/api/vault',
  
  async getSecrets() {
    const response = await axios.get(`${this.baseURL}/secrets`);
    return response.data;
  },
  
  async setSecret(key, value, encrypted = true) {
    const response = await axios.post(`${this.baseURL}/secrets`, { key, value, encrypted });
    return response.data;
  },
  
  async deleteSecret(key) {
    const response = await axios.delete(`${this.baseURL}/secrets/${key}`);
    return response.data;
  },
  
  async importEnv(envContent) {
    const response = await axios.post(`${this.baseURL}/import`, { envContent });
    return response.data;
  },
  
  async exportEnv() {
    const response = await axios.get(`${this.baseURL}/export`, { responseType: 'blob' });
    return response.data;
  },
  
  async getStatus() {
    const response = await axios.get(`${this.baseURL}/status`);
    return response.data;
  }
};

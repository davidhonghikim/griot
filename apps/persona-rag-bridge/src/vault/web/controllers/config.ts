import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class ConfigController {
  private configPath = path.join(process.cwd(), 'config', 'services.json');

  async getConfig(_req: Request, res: Response) {
    try {
      if (fs.existsSync(this.configPath)) {
        const configData = fs.readFileSync(this.configPath, 'utf8');
        const config = JSON.parse(configData);
        res.json(config);
      } else {
        // Return default configuration
        const defaultConfig = {
          openWebUI: { url: 'http://192.168.1.180:3000', apiKey: '' },
          personaRAG: { url: 'http://localhost:5000' },
          vectorStore: { url: 'http://localhost:8080' },
          embeddingService: { model: 'text-embedding-ada-002', dimensions: 1536 }
        };
        res.json(defaultConfig);
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  async saveConfig(req: Request, res: Response) {
    try {
      const config = req.body;
      
      // Ensure config directory exists
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
      
      // Save configuration
      fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
      
      res.json({ success: true, message: 'Configuration saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  async testConnection(req: Request, res: Response) {
    try {
      const { service } = req.params;
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'Service URL is required' });
      }
      
      let healthUrl = url;
      if (service === 'openWebUI') {
        healthUrl = `${url}/api/v1/health`;
      } else if (service === 'vectorStore') {
        healthUrl = `${url}/v1/.well-known/ready`;
      } else {
        healthUrl = `${url}/health`;
      }
      
      const response = await axios.get(healthUrl, { timeout: 5000 });
      
      res.json({ 
        success: true, 
        message: `${service} connection successful`,
        status: response.status,
        data: response.data
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  }
}

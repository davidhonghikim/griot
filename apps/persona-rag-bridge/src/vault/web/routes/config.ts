import { Router } from 'express';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vault-config' });
});

export { router as configRoutes }; 
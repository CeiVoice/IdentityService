import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Identity Server is running!',
    timestamp: new Date().toISOString()
  });
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

export default router;

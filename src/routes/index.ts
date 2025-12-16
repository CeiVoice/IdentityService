import { Router, Request, Response } from 'express';
import SignupController from "../controllers/signup.controller";
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

router.post('/signup', async (req: Request, res: Response) => {
  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    const result = await SignupController.SignupByEmail(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Signup failed' });
  }
});

export default router;

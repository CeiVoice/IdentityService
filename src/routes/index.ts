import { Router, Request, Response } from 'express';
import SignupController from "../controllers/signup.controller";
import SigninByEmail from "../controllers/signin.controller"
import EmailConfirmController from "../controllers/EmailConfirm.Controller"
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
    const result = await SignupController.SignupByEmail(req.body);
    res.status(201).json({ success: true});
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Signup failed' });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const result = await SigninByEmail.SigninByEmail(req.body);
    res.status(201).json({ success: true,token:result});
  } catch (error) {
    console.error('Signin error:', error);
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Signin failed' });
  }
});

router.get("/confirm-email/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }
    const result = await EmailConfirmController.confirmEmail(token);
    res.status(200).json(result);
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Email confirmation failed' });
  }
});

export default router;

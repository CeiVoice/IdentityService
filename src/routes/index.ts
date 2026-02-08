import { Router, Request, Response } from 'express';
import SignupController from "../controllers/signup.controller";
import SigninByEmail from "../controllers/signin.controller"
import EmailConfirmController from "../controllers/EmailConfirm.Controller"

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: User ID
 *         Email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         EmailConfirm:
 *           type: boolean
 *           description: Email confirmation status
 *         IsSuperAdmin:
 *           type: boolean
 *           description: Super admin status
 *         ProfileId:
 *           type: integer
 *           description: Associated profile ID
 *         CreateAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         UpdateAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         IsBanned:
 *           type: boolean
 *           description: Account ban status
 *     SignupRequest:
 *       type: object
 *       required:
 *         - Fname
 *         - Lname
 *         - Email
 *         - Password
 *       properties:
 *         Fname:
 *           type: string
 *           description: User's first name
 *           example: "John"
 *         Lname:
 *           type: string
 *           description: User's last name
 *           example: "Doe"
 *         Email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         Password:
 *           type: string
 *           description: User's password
 *           example: "securePassword123"
 *     SigninRequest:
 *       type: object
 *       required:
 *         - Email
 *         - Password
 *       properties:
 *         Email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         Password:
 *           type: string
 *           description: User's password
 *           example: "securePassword123"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 */
const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: Service Status
 *     description: Get basic service status and timestamp
 *     responses:
 *       200:
 *         description: Service status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Identity Server is running!"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-02-08T10:30:00.000Z"
 */
router.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Identity Server is running!',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health Check
 *     description: Check service health status
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

/**
 * @swagger
 * /signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Registration
 *     description: Create a new user account with email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const result = await SignupController.SignupByEmail(req.body);
    res.status(201).json({ success: true});
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Signup failed' });
  }
});

/**
 * @swagger
 * /signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Login
 *     description: Authenticate user and return JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SigninRequest'
 *     responses:
 *       201:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const result = await SigninByEmail.SigninByEmail(req.body);
    res.status(201).json({ success: true,token:result});
  } catch (error) {
    console.error('Signin error:', error);
    res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Signin failed' });
  }
});

/**
 * @swagger
 * /confirm-email/{token}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Email Confirmation
 *     description: Confirm user email address using verification token
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Email confirmation token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Email confirmation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

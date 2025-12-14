import express from 'express';
import { config } from './config';
import { setupMiddleware } from './middleware';
import indexRoutes from './routes';

const app = express();


setupMiddleware(app);

app.use('/', indexRoutes);

export default app;
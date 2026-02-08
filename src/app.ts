import express from 'express';
import { setupMiddleware } from './middleware';
import indexRoutes from './routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CeiVoice Identity Server API',
      version: '1.0.0',
      description: 'Authentication and user management service for CeiVoice platform',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/index.ts'], 
};

const app = express();

const specs = swaggerJSDoc(swaggerOptions);



setupMiddleware(app);

app.use('/', indexRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

export default app;
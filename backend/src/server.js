import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import documentsRouter from './routes/documents.js';
import contactRouter from './routes/contact.js';
import quotationRouter from './routes/quotation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Configure CORS
app.use(
  cors({
    origin: '*', // Allow all origins for seamless development & production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static documents from free local storage
const uploadsDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/docs', documentsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/quotation', quotationRouter);

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to Siddhivinayak Auto World Express.js API',
    endpoints: {
      docs_otp: 'POST /api/docs/request-otp',
      docs_verify: 'POST /api/docs/verify-otp',
      contact: 'POST /api/contact',
      quotation: 'POST /api/quotation',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server (only if not imported by serverless function)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Siddhivinayak Express Backend running on http://localhost:${PORT}`);
  });
}

export default app;

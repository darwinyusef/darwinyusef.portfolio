import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatAssistantRouter from './routes/chat-assistant.js';
import askAiRouter from './routes/ask-ai.js';
import newsletterRouter from './routes/newsletter.js';
import sendEmailRouter from './routes/send-email.js';
import contactRouter from './routes/contact.js';
import testimonialRouter from './routes/testimonial.js';
import downloadCvRouter from './routes/download-cv.js';
import downloadResourceRouter from './routes/download-resource.js';
import minioAdminRouter from './routes/minio-admin.js';
import calendarRouter from './routes/calendar.js';
import youtubeRouter from './routes/youtube.js';
import appointmentsRouter from './routes/appointments.js';
import { initializeMinio } from './services/minio-storage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/chat-assistant', chatAssistantRouter);
app.use('/api/ask-ai', askAiRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/send-email', sendEmailRouter);
app.use('/api/contact', contactRouter);
app.use('/api/testimonial', testimonialRouter);
app.use('/api/download-cv', downloadCvRouter);
app.use('/api/resources', downloadResourceRouter);
app.use('/api/minio', minioAdminRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/oauth2callback', calendarRouter);
app.use('/api/youtube', youtubeRouter);
app.use('/api/appointments', appointmentsRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Error interno del servidor'
  });
});

// Inicializar MinIO al arrancar
initializeMinio().then((success) => {
  if (success) {
    console.log('✅ MinIO inicializado correctamente');
  } else {
    console.warn('⚠️ MinIO no disponible - usando fallback local');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

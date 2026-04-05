import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { logger } from './utils/logger';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});


//response logging middleware 
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    const status = res.statusCode;
    const success = status >= 200 && status < 300 ? 'success' : 'Errors';
    const bodyStr = typeof body === 'object' ? JSON.stringify(body) : body;
    logger.info(
      `Response: ${req.method} ${req.url} - Status : ${status} (${success}) - Body: ${bodyStr.slice(0, 500)}...`,
    );
    return originalSend.call(this, body);
  };
  next();
});

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})
export default app;

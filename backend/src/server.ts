import app from './app';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const PORT = process.env.PORT;

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  let attempt = 0;
  while (attempt < 3) {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2010'
      ) {
        attempt++;
        console.warn(`Retry ${attempt}/${retries} after timeout`);
        await new Promise(res => setTimeout(res, delay * attempt));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeds');
}

async function StartServer() {
  try {
    await withRetry(() => prisma.$connect());
    console.log('Connected to mongoDB');
    const server = app.listen(PORT, () => {
      console.log(`Server is running on the port ${PORT}`);
    });
    server.on('error', err => console.error('server error', err));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

StartServer();

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

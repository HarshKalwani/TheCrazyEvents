import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';
import { OAuth2Client } from 'google-auth-library';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signUpWithEmail = async (data: {
  name: string;
  email: string;
  password: string;
  location?: string | null;
}) => {
  const { name, email, password, location } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      location: location ?? null,
    },
  });
  logger.info(`User created as userL : ${user.id}`);
  return {
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    isOrganizer: false,
  };
};

export const loginWithEmail = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      _count: {
        select: {
          groupsCreated: true,
        },
      },
    },
  });
  if (
    !user ||
    !user.password ||
    !(await bcrypt.compare(password, user.password))
  ) {
    throw new Error('Invalid email or password');
  }
  const isOrganizer = (user._count.groupsCreated ?? 0) > 0;
  logger.info(
    `User logged in as ${isOrganizer ? 'organizer' : 'user'}: ${user.id}`,
  );
  return {
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    isOrganizer: false,
  };
};

export const loginWithGoogle = async (idToken: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid user token');
  }
  let user = await prisma.user.findUnique({
    where: {
      email: payload.email!,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload?.name!,
        email: payload?.email!,
        profilePic: payload.picture!,
      },
    });
  }

  logger.info(`Google Login: ${user.id}`);
  return {
    accessToken: generateAccessToken(user.id),
    refreshToken: generateRefreshToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      location: user.location,
    },
  };
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: string };
    return generateAccessToken(decoded.id);
  } catch {
    throw new Error('Invalid refresh token');
  }
};

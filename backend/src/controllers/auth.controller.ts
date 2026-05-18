import { PrismaClient } from '@prisma/client';
import { type Request, type Response } from 'express';
import { z, ZodError } from 'zod';
import { logger } from '../utils/logger';
import { loginWithEmail, loginWithGoogle, refreshAccessToken, signUpWithEmail } from '../services/auth.service';

const prisma = new PrismaClient();

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  location: z.string().optional(),
});

export const signUp = async (req: Request, res: Response) => {
  try {
    const validateData = signUpSchema.parse(req.body);
    const { accessToken, refreshToken } = await signUpWithEmail({
      ...validateData,
      location: validateData.location ?? null,
    });

    const user = await prisma.user.findUnique({
      where: {
        email: validateData.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: 'Validation error', errors: error });
    }
    logger.error('Signup Error', error);
    res.status(400).json({ message: error.message });
  }
};

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const login = async (req: Request, res: Response) => {
  try {
    const validateData = loginSchema.parse(req.body);
    const {accessToken, refreshToken, isOrganizer} = await loginWithEmail(validateData);
    const user = await prisma.user.findUnique({
      where:{
        email:validateData.email
      },
      select:{
        id:true,
        name:true,
        email:true,
        location:true,
      }
    })
    return res.json({
      accessToken,
      refreshToken,
      isOrganizer,
      user
    });
  } catch (error:any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: error.message,
      });
    }
    logger.error('Login Error', error);
    res.status(400).json({ message: error.message });
  }
};

export const googleLoginController = async (req: Request, res: Response) => {
  try {
    const {idToken} = req.body;
    const {accessToken , refreshToken , user} = await loginWithGoogle(idToken);
    res.json({accessToken , refreshToken , user});
  } catch (error:any) {
    logger.error('Google Login Error', error);
    res.status(401).json({ message: error.message });
  }
}

export const refresh = async(req: Request, res: Response) => {
  try {
    const {refreshToken} = req.body;
    const accessToken = await refreshAccessToken(refreshToken);
    res.json({accessToken});
  } catch (error:any) {
    logger.error("Refresh Error",error);
    res.status(401).json({message:error.message});
  }
}
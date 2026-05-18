import type { Request, Response } from 'express';
import { logger } from '../utils/logger';
import {
  getUserGroups,
  getUserProfile,
  getUserRSVPs,
  updateUserProfile,
} from '../services/user.service';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserProfile(req.user!.id);
    res.json(user);
  } catch (error: any) {
    logger.error('Get profile error: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const getRSVPs = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const rsvps = await getUserRSVPs(
      req.user!.id,
      parseInt(page as string),
      parseInt(limit as string),
    );
    res.json(rsvps);
  } catch (error: any) {
    logger.error('Get RSVPs error: ' + error);
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await updateUserProfile(req.user!.id, req.body);
    res.json(user);
  } catch (error: any) {
    logger.error('Update profile error:' + error);
    res.status(400).json({ message: error.message });
  }
};

export const getUsersGroupsController =  async(req: Request, res: Response) => {
  try {
    const {id:userId} = req.user;
    const {page = '1', limit = '10'} = req.query;
    const groups = await getUserGroups(userId,Number(page),Number(limit));
    res.json(groups);
  } catch (error:any) {
    logger.error('Get user groups error:' + error);
    res.status(400).json({
      message:error.message
    })
  }
}

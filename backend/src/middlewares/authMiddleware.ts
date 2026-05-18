import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message:"No Token Provided"
        })
    }

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET!);
        req.user = decoded as {id:string}
        next();
    } catch (error) {
        logger.error("JWT Error ", error);
        res.status(401).json({
            message:"invalid token"
        })
    }
}
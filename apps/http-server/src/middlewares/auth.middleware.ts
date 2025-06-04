import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1]; // assuming Bearer token
        if (!token) {
            res.status(403).json({
                error: "Unauthorized | token required"
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        if (!decoded.userId) {
            res.status(403).json({
                error: "Unauthorized | invalid token"
            });
            return;
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({
            error: "Unauthorized | invalid token"
        });
    }
}

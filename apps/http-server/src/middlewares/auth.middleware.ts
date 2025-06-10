import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            res.status(403).json({
                error: "Unauthorized | token required"
            });
            return;
        }

        const decoded = jwt.verify(token as string, JWT_SECRET);
        if (!(decoded as JwtPayload).userId) {
            res.status(403).json({
                error: "Unauthorized | invalid token"
            });
            return;
        } else {
            //@ts-ignore
            req.userId = (decoded as JwtPayload).userId;
            next();
        }
    } catch (error) {
        res.status(403).json({
            error: "Unauthorized | invalid token"
        });
    }
}

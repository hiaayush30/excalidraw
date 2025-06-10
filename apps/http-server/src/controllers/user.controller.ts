import { Request, Response } from "express";

import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = SigninSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(403).json({
                error: data.error.errors.flat()
            })
        }
        const { email, password } = data.data;
        const existing = await prismaClient.user.findFirst({ where: { email } });
        if (!existing) {
            return res.status(403).json({
                error: "email or password incorrect"
            })
        }
        const passwordMatch = await bcrypt.compare(password, existing.password);
        if (!passwordMatch) {
            return res.status(403).json({
                error: "email or password incorrect"
            })
        }
        const token = jwt.sign({ userId: existing.id }, JWT_SECRET);
        res.setHeader("authorization", token);
        return res.status(200).json({
            message: "signed-in successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = req.body;
        const parsed = CreateUserSchema.safeParse(data);
        if (!parsed.success) {
            return res.status(403).json({
                error: parsed.error.errors
            })
        }
        const { name, password, email } = parsed.data;
        const existing = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { email },
                    { name },
                ],
            }
        })
        if (existing) {
            return res.status(403).json({
                error: "email or name already taken"
            })
        }
        const hashed = await bcrypt.hash(password, 5);
        const user = await prismaClient.user.create({
            data: {
                email,
                name,
                password: hashed,
                photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
        });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        res.setHeader("authorization", token);
        res.status(201).json({
            message: "account created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Signup failed! | Internal server error"
        })
    }
}

const room = async (req: Request, res: Response):Promise<any> => {
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(403).json({
                error: parsedData.error,
            })
        }
        const { name } = parsedData.data;
        const userId = req.userId;
        const existing = await prismaClient.room.findFirst({
            where: {
                slug: name
            }
        });
        if (existing) {
            return res.status(403).json({
                error: "room with that name already exists"
            })
        }
        const room = await prismaClient.room.create({
            data: {
                adminId: Number(userId),
                slug: name
            }
        })
        res.status(201).json({
            roomId: room.id,
            name: room.slug,
            message: "room created successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

export {
    login,
    signup,
    room
}
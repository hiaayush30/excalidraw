import { Request, Response } from "express";

import { CreateUserSchema, SigninSchema } from "@repo/common/types";

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const data = SigninSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(403).json({
                error: data.error.errors.flat()
            })
        }
        const { username, password } = data.data;
        res.send("hi")
        // check  db 
        // generate token
    } catch (error) {
        console.log(error);
    }
}

const signup = async (req: Request, res: Response): Promise<any> => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Signup failed! |Internal server error"
        })
    }
}

const room = async (req: Request, res: Response) => {
    try {
        res.json({
            roomId: 123
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
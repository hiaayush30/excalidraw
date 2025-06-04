import { Router } from "express";
import { login, room, signup } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter:Router = Router();

userRouter.post("/login",login);
userRouter.post("/signup",signup);
userRouter.post("/room",authMiddleware,room);

export default userRouter;
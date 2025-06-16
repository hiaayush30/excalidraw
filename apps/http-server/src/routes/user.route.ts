import { Router } from "express";
import { getChats, getRoomId, login, room, signup } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter:Router = Router();

userRouter.post("/login",login);
userRouter.post("/signup",signup);
userRouter.post("/room",authMiddleware,room);
userRouter.get("/chats/:roomId",authMiddleware,getChats);
userRouter.get("/room/:slug",authMiddleware,getRoomId);

export default userRouter;
import WebSocket, { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client"

const ws = new WebSocketServer({
    port: 5000
})

type UserType = {
    userId: number;
    rooms: Array<number>;
    ws: WebSocket
}

type MessageType = {
    type: string,
    roomId?: number;
    message?: string;
}

let users: UserType[] = []

const checkUserId = (token: string): number | null => {
    try {
        if (token.length === 0) {
            return null;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded == "string") {
            return null;
        }
        const userId = (decoded as JwtPayload).userId;
        if (!userId) {
            return null;
        }
        return userId;
    } catch (error) {
        return null;
    }
}

ws.on("connection", (socket: WebSocket, request) => {
    console.log("client connected");

    //getting token in url param and decoding it
    const url = request.url;
    if (!url) {
        socket.close();
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") ?? "";
    const userId = checkUserId(token);
    if (!userId) {
        socket.close();
        return;
    }

    //main part
    users.push({
        userId: userId,
        rooms: [],
        ws: socket
    })
    console.log("user added");
    socket.on("message", async (message) => {
        const data: MessageType = JSON.parse(message as unknown as string);
        if (!data.type) return;

        if (data.type == "join_room") {
            if (!data.roomId) return;

            const user = users.find(user => user.ws == socket);
            if (!user) return socket.send(JSON.stringify({ error: "user not found" }));
            user.rooms.push(data.roomId);
            socket.send("joined room");
        }
        else if (data.type == "leave_room") {
            if (!data.roomId) return;

            const user = users.find(user => user.ws == socket);
            if (!user) return socket.send(JSON.stringify({ error: "user not found" }));
            user.rooms = user.rooms.filter(room => room !== data.roomId);
            socket.send("room left");
        }

        else if (data.type == "chat") {
            if (!data.message || !data.roomId) return;

            const user = users.find(user => user.ws == socket);
            //check if user is present in the room
            if (!user || !user.rooms.includes(data.roomId)) {
                return socket.send(JSON.stringify({
                    error: "user not found | room not found"
                }))
            }
            try {
                await prismaClient.chat.create({
                    data: {
                        roomId:Number(data.roomId),
                        userId:Number(user.userId),
                        message:data.message
                    }
                })
            } catch (error) {
                 socket.send(JSON.stringify({
                    error:"failed to send chat"
                 }));
                 return;
            }
            const targetUsers = users.filter(user => user.rooms.includes(data.roomId as number));
            targetUsers.forEach((user) => {
                if (user.ws !== socket) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: data.message,
                        roomId: data.roomId
                    }))
                }
            })
            socket.send("message sent");
        }
    })

    socket.on("close", () => {
        users = users.filter(user => user.userId !== userId)
    })
})
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const ws = new WebSocketServer({
    port: 5000
})

ws.on("connection", (socket: WebSocket, request) => {
    //getting token in url param and decoding it
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") ?? "";
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const userId = decoded.userId;
        if (!userId) {
            socket.close();
            return;
        }
        socket.on("message", (data) => {
            console.log("recieved:" + data);
            socket.send("pong");
        })
    } catch (error) {
        console.error("error in decoding token:", error);
        return;
    }
    console.log("client connected");
    socket.send("hello there");
})
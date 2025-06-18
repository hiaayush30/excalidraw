import { WS_URL } from "@/config";
import { useEffect, useState } from "react"

export const useSocket = (accessToken: String, roomId: number) => {
    const [loading, setLoading] = useState(true);
    const [webSocket, setWebSocket] = useState<null | WebSocket>(null);
    useEffect(() => {
        const socket = new WebSocket(`${WS_URL}?token=${accessToken}`);
        socket.onopen = () => {
            setWebSocket(socket);
            setLoading(false);
            socket.send(
                JSON.stringify({
                    type: 'join_room',
                    roomId,
                })
            );
        }
        return () => {
            socket.close();
        }
    }, [])
    return {
        webSocket,
        loading
    }
}
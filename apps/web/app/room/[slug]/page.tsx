"use client"
import { BACKEND_URL, WS_URL } from '@/config';
import axios from 'axios';
import { Socket } from 'dgram';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Room() {
    const { slug } = useParams();
    const router = useRouter();
    const { data, status } = useSession();
    const [webSocket, setWebSocket] = useState<WebSocket>()
    const [chats, setChats] = useState<string[]>([])

    const getRoomId = async (token: string): Promise<string | null> => {
        try {
            const response = await axios.get(BACKEND_URL + "/api/user/room/" + slug, {
                headers: {
                    "authorization": token
                }
            });
            return response.data.roomId;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    useEffect(() => {
        if (status == "unauthenticated") {
            return router.replace("/login");
        }
        else if (status == "authenticated") {
            connectWebServer();
        }

        return () => {
            if (webSocket) {
                webSocket.close();
            }
        }
    }, [status, data])

    const connectWebServer = async () => {
        if (!data) return;
        const socket = new WebSocket(WS_URL + "?token=" + data.user.accessToken);
        const roomId = await getRoomId(data.user.accessToken);

        socket.addEventListener("open", () => {
            setWebSocket(socket);
            socket.send(JSON.stringify({
                type: "join_room",
                roomId,
            }))
        })

        socket.onmessage = async (message) => {
            console.log(message);
            if (typeof message == "string") {
                const data = await JSON.parse(message);
                if (data.error) {
                    return alert(data.error);
                }
                if (data.message) {
                    return alert(data.message);
                }
            }
        }
    }

    return (
        <div>
            Welcome to room {slug}
        </div>
    )
}

export default Room

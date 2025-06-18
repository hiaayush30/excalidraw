"use client"

import { WS_URL } from '@/config';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useRef, useState } from 'react'

function ChatRoomClient({ roomId, accessToken }: { roomId: string, accessToken: string }) {
    const [message, setMessage] = useState("");
    const router = useRouter();
    const { data, status } = useSession();
    const [webSocket, setWebSocket] = useState<WebSocket>()
    const inputRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef) {
            inputRef.current?.focus();
        }
    }, [])

    useEffect(() => {
        if (status == "unauthenticated") {
            return router.replace("/login");
        }
        else if (status == "authenticated") {
            console.log("Hello There");
            connectWebServer();
        }
        return () => {
            if (webSocket) {
                webSocket.close();
            }
        }
    }, [status])

    const connectWebServer = async () => {
        if (!data) return;
        const socket = new WebSocket(WS_URL + "?token=" + accessToken);

        socket.addEventListener("open", () => {
            setWebSocket(socket);
            socket.send(JSON.stringify({
                type: "join_room",
                roomId,
            }))
        })

        socket.onmessage = async (message) => {
            console.log(message);
            const data = await JSON.parse(message.data);
            if (data.error) {
                return alert(data.error + " | try reloading the page ");
            }
            if (data.message) {
                return alert(data.message);
            }
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!message) {
            return alert("Message can't be empty");
        }
        if (!webSocket) {
            return alert("Not connected to server! | try reloading the page")
        } else {
            webSocket.send(JSON.stringify({
                type: "chat",
                message,
                roomId: roomId
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex justify-center items-center gap-5'>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                ref={inputRef}
                className='p-1 outline-2 rounded-lg' type='text' placeholder='Start typing...' />
            <button className='bg-blue-600 p-1 rounded-lg hover:bg-blue-500 cursor-pointer' type='submit'>Send</button>
        </form>
    )
}

export default ChatRoomClient

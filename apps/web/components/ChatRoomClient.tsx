'use client';

import { WS_URL } from '@/config';
import { CopyIcon, LogOutIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { toast } from 'sonner';

type ChatType = {
    id: number;
    message: string;
    userId: number;
    roomId: number;
    createdAt: Date;
};

type Props = {
    roomId: number;
    roomName: string;
    accessToken: string;
    initialChats: ChatType[];
};

export default function ChatRoomClient({
    roomId,
    roomName,
    accessToken,
    initialChats,
}: Props) {
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState<ChatType[]>(initialChats);
    const [webSocket, setWebSocket] = useState<WebSocket>();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { data, status } = useSession();

    const focusDiv = useRef<null|HTMLDivElement>(null);

    useEffect(() => {
        focusDiv.current?.scrollIntoView({behavior:"smooth"});
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        } else if (status === 'authenticated') {
            connectWebSocket();
        }

        return () => {
            webSocket?.close();
        };
    }, [status]);

    const connectWebSocket = () => {
        const socket = new WebSocket(`${WS_URL}?token=${accessToken}`);
        socket.addEventListener('open', () => {
            setWebSocket(socket);
            socket.send(
                JSON.stringify({
                    type: 'join_room',
                    roomId,
                })
            );
        });

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chat') {
                setChats((prev) => [...prev, data.chat]);
            } else if (data.message || data.error) {
                toast(data.message || data.error);
            }
        };
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return toast("Message can't be empty");

        if (!webSocket) {
            return toast('WebSocket not connected. Try reloading.');
        }

        const newChat: ChatType = {
            id: Date.now(), //temp id
            message,
            userId: data?.user.id || 0,
            roomId: roomId,
            createdAt: new Date(),
        };

        webSocket.send(
            JSON.stringify({
                type: 'chat',
                message,
                roomId,
            })
        );

        setChats((prev) => [...prev, newChat]); // optimistic update
        setMessage('');
        focusDiv.current?.scrollIntoView({behavior:"smooth"});
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white flex flex-col">
            <header className="p-4 flex gap-3 items-center justify-between text-2xl font-bold border-b border-blue-800 shadow-md">
                <div className='flex gap-2 items-center'>
                    Room: {roomName}
                    <button
                        onClick={() => {
                            window.navigator.clipboard.writeText(roomName);
                            toast("copied!")
                        }}>
                        <CopyIcon className='hover:scale-110 hover:cursor-pointer' />
                    </button>
                </div>
                <button
                    onClick={() => {
                        webSocket?.close();
                        return router.push("/dashboard");
                    }}
                    className="text-red-500 text-sm flex items-center gap-2 cursor-pointer">
                    <span>Exit</span>
                    <LogOutIcon />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className="bg-blue-800/50 p-3 rounded-md shadow hover:bg-blue-700/50 transition"
                    >
                        <div className="text-sm text-gray-300">User {chat.userId}</div>
                        <div className="text-lg">{chat.message}</div>
                        <div className="text-xs text-gray-400">
                            {new Date(chat.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}
                <div className='h-16' ref={focusDiv}></div>
            </div>

            <footer className="p-4 border-t border-blue-800 bg-black/90 sticky bottom-0">
                <form onSubmit={handleSubmit} className="lg:w-[50vw] md:w-[60vw] sm:w-[80vw] mx-auto flex justify-center items-center gap-5">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        ref={inputRef}
                        className="p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 w-full"
                        type="text"
                        placeholder="Start typing..."
                    />
                    <button
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 cursor-pointer"
                        type="submit"
                    >
                        Send
                    </button>
                </form>
            </footer>
        </div>
    );
}

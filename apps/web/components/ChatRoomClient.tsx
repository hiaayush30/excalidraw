'use client';

import { CopyIcon, LogOutIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { toast } from 'sonner';
import { useSocket } from '@/hooks/useSocket';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const focusDiv = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { data, status } = useSession();
  const { webSocket, loading } = useSocket(accessToken, roomId);

  useEffect(() => {
    focusDiv.current?.scrollIntoView({ behavior: 'smooth' });
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && loading === false) {
      configureWebSocket();
    }
  }, [status, loading]);

  const configureWebSocket = () => {
    if (!webSocket) {
      return toast('Could not connect to live chat | Reload or login again!');
    }
    toast('Connected to live chatroom');

    webSocket.onmessage = (event) => {
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
    if (!webSocket) return toast('WebSocket not connected. Try reloading.');

    const newChat: ChatType = {
      id: Math.random(),
      message,
      userId: data?.user.id || 10,
      roomId,
      createdAt: new Date(),
    };

    webSocket.send(
      JSON.stringify({
        type: 'chat',
        message,
        roomId,
      })
    );

    setChats((prev) => [...prev, newChat]);
    setMessage('');
    focusDiv.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a05] via-[#2e0d08] to-[#3a0c0c] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex gap-3 items-center justify-between text-2xl font-bold border-b border-red-900 bg-[#1a0a05]/80 shadow-md">
        <div className="flex gap-2 items-center">
          Room: {roomName}
          <button
            onClick={() => {
              navigator.clipboard.writeText(roomName);
              toast('Copied!');
            }}
          >
            <CopyIcon className="hover:scale-110 hover:cursor-pointer text-red-400" />
          </button>
        </div>
        <button
          onClick={() => {
            webSocket?.close();
            return router.push('/dashboard');
          }}
          className="text-red-400 text-sm flex items-center gap-2 cursor-pointer hover:text-red-200"
        >
          <span>Exit</span>
          <LogOutIcon />
        </button>
      </header>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="bg-red-800/40 p-3 rounded-md shadow hover:bg-red-700/40 transition"
          >
            <div className="text-sm text-red-300">User {chat.userId}</div>
            <div className="text-lg text-red-100">{chat.message}</div>
            <div className="text-xs text-red-400">
              {new Date(chat.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        <div className="h-16" ref={focusDiv}></div>
      </div>

      {/* Input Box */}
      <footer className="p-4 border-t border-red-900 bg-[#1a0a05]/90 sticky bottom-0">
        <form
          onSubmit={handleSubmit}
          className="lg:w-[50vw] md:w-[60vw] sm:w-[80vw] mx-auto flex justify-center items-center gap-5"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={inputRef}
            className="p-2 rounded-lg bg-[#3a0c0c] text-white placeholder-red-300 w-full"
            type="text"
            placeholder="Start typing..."
          />
          <button
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 text-white"
            type="submit"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}

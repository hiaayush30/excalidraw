import { BACKEND_URL } from '@/config';
import axios from 'axios';
import { redirect } from 'next/navigation';
import ChatRoomClient from './ChatRoomClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@repo/auth/nextAuth';
import React from 'react';

const getChats = async (roomId: string,accessToken:string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/chats/${roomId}`,{
      headers:{
        "authorization":accessToken
      }
    });
    return response.data.chats;
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    return [];
  }
};

type ChatType = {
  id: number;
  message: string;
  userId: number;
  roomId: number;
  createdAt: Date;
};

export default async function ChatRoom({
  props,
}: {
  props: { roomId: string; roomName: string };
}) {
  const { roomId, roomName } = props;

  const session = await getServerSession(authOptions(process.env.NEXTAUTH_SECRET as string));
  if (!session) return redirect('/login');

  const chats: ChatType[] = await getChats(roomId,session.user.accessToken);

  chats.push({
    id:1,
    createdAt:new Date(),
    message:"Hello There",
    roomId:123,
    userId:2652
  },
{
    id:2,
    createdAt:new Date(),
    message:"Hello There jhbecbrjhe3c",
    roomId:123,
    userId:2652
  },
  {
    id:3,
    createdAt:new Date(),
    message:"Hello There rfijerfciurc",
    roomId:123,
    userId:2652
  }
)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white flex flex-col">
      <header className="p-4 text-2xl font-bold border-b border-blue-800 shadow-md">
        Room: {roomName}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:w-[90vw] md:w-[70vw] lg:w-[60vw] mx-auto">
        {chats.reverse().map((chat) => (
          <div
            key={chat.id}
            className="bg-blue-800/50 p-3 rounded-md shadow hover:bg-blue-700/50 transition"
          >
            <div className="text-sm text-gray-300">User {chat.userId}</div>
            <div className="text-lg">{chat.message}</div>
            <div className="text-xs text-gray-400">{new Date(chat.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <footer className="p-4 border-t border-blue-800 bg-black/50">
        <ChatRoomClient accessToken={session.user.accessToken} roomId={roomId} />
      </footer>
    </div>
  );
}

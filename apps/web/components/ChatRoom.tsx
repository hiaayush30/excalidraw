import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@repo/auth/nextAuth';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import ChatRoomClient from './ChatRoomClient';

const getChats = async (roomId: number, accessToken: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/user/chats/${roomId}`, {
      headers: {
        authorization: accessToken,
      },
    });
    return response.data.chats;
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    return [];
  }
};

export default async function ChatRoom({
  props,
}: {
  props: { roomId: number; roomName: string };
}) {
  const { roomId, roomName } = props;

  const session = await getServerSession(authOptions(process.env.NEXTAUTH_SECRET as string));
  if (!session) return redirect('/login');

  const chats = await getChats(roomId, session.user.accessToken);

  return (
    <ChatRoomClient
      roomId={roomId}
      roomName={roomName}
      accessToken={session.user.accessToken}
      initialChats={chats}
    />
  );
}

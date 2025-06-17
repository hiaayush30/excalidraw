import ChatRoom from '@/components/chatRoom';
import { BACKEND_URL, WS_URL } from '@/config';
import { authOptions } from '@repo/auth/nextAuth';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

async function Room({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const session = await getServerSession(authOptions(process.env.NEXTAUTH_SECRET as string));
    if (!session?.user) {
        return redirect("/login");
    }
    try {
        const response = await axios.get(BACKEND_URL + "/api/user/room/" + slug, {
            headers: {
                "authorization": session.user.accessToken
            }
        });
        return (
            <>
                <ChatRoom props={{ roomId: response.data.roomId, roomName: slug }} />
            </>
        )
    } catch (error) {
        console.log("room not found:", error);

        //render a room-not-found page with try-again and return option
        return redirect("/dashboard");
    }
}

export default Room

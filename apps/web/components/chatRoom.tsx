"use client"
import { BACKEND_URL, WS_URL } from '@/config'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function ChatRoom({ props }: { props: { roomId: string, roomName: string } }) {
  const { roomId, roomName } = props;
  const router = useRouter();

  const { data, status } = useSession();

  const [webSocket, setWebSocket] = useState<WebSocket>()
  const [chats, setChats] = useState<string[]>([])

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
      Welcome to room {roomName}
    </div>
  )
}

export default ChatRoom

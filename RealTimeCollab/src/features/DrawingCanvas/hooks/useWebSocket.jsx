import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

function useWebSocket(onMessage, subUndo, roomId) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  // Keep latest callbacks in refs so we don't break effect dependencies
  const onMessageRef = useRef(onMessage);
  const subUndoRef = useRef(subUndo);
  const roomIdRef = useRef(roomId);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  useEffect(() => {
    subUndoRef.current = subUndo;
  }, [subUndo]);
  
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("STOMP:", str),
    });

    client.onConnect = (frame) => {
      console.log("connected", frame);
      setConnected(true);

      client.subscribe("/topic/draw/undo", (message) =>
        subUndoRef.current(message),
      );
      client.subscribe(`/topic/room.${roomIdRef.current}`, (message) =>
        onMessageRef.current(message),
      );
    };

    client.onDisconnect = () => {
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);
  return { connected, client: clientRef.current };
}

export default useWebSocket;

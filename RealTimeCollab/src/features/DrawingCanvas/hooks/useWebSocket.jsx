import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

function useWebSocket(onDraw, onStop, subUndo, onErase) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  // Keep latest callbacks in refs so we don't break effect dependencies
  const onDrawRef = useRef(onDraw);
  const onStopRef = useRef(onStop);
  const subUndoRef = useRef(subUndo);
  const onEraseRef = useRef(onErase);

  useEffect(() => {
    onDrawRef.current = onDraw;
  }, [onDraw]);
  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);
  useEffect(() => {
    subUndoRef.current = subUndo;
  }, [subUndo]);
  useEffect(() => {
    onEraseRef.current = onErase;
  }, [onErase]);

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

      client.subscribe("/topic/draw/start", (message) =>
        onDrawRef.current(message),
      );
      client.subscribe("/topic/draw/stop", (message) =>
        onStopRef.current(message),
      );
      client.subscribe("/topic/draw/undo", (message) =>
        subUndoRef.current(message),
      );
      client.subscribe("/topic/draw/erase", (message) =>
        onEraseRef.current(message),
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

import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

function useWebSocket(onWrite) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(
    function () {
      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.log("STOMP:", str),
      });

      client.onConnect = (frame) => {
        console.log("conntected ", frame);
        setConnected((s) => {
          console.log("here i am setting true");
          return true;
        });

        client.subscribe("/topic/write", (message) => onWrite(message));
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
    },
    [onWrite]
  );

  return { connected, client: clientRef.current };
}

export default useWebSocket;

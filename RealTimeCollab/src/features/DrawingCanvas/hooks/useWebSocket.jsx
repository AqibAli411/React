import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

function useWebSocket(subscriptions) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const subsRef = useRef(subscriptions);


  useEffect(() => {
    subsRef.current = subscriptions;
  }, [subscriptions]);


  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("STOMP:", str),
    });

    client.onConnect = () => {
      setConnected(true);
      subsRef.current.forEach(({ topic, handler }) => {
        client.subscribe(topic, handler);
      });
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

import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

//custom hook to handle the connecting logic
//onMessage is the subscribe call back
function useWebSocket(onDraw, onStop, subUndo) {
  const [connected, setConnected] = useState(false);
  //saves the client
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

      //Callback, invoked on every successful connection to the STOMP broker.
      client.onConnect = (frame) => {
        console.log("conntected ", frame);
        //This will help us "send" data with gurantee
        setConnected(true);

        //For each topic, call the subscribe with given onDraw method
        client.subscribe("/topic/draw/start", (message) => onDraw(message));

        //For each topic, call the subscribe with given onStop method
        client.subscribe("/topic/draw/stop", (message) => onStop(message));

        //undo
        client.subscribe("/topic/draw/undo", (message) => subUndo(message));
      };

      //   Callback, invoked on every successful disconnection from the STOMP broker
      client.onDisconnect = () => {
        setConnected(false);
      };

      //starts the connection with broker
      client.activate();
      clientRef.current = client;

      return () => {
        if (clientRef.current) {
          clientRef.current.deactivate();
        }
      };
    },
    [onDraw, onStop, subUndo]
  );

  return { connected, client: clientRef.current };
}

export default useWebSocket;

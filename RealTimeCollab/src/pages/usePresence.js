import { useEffect, useState } from "react";
import useWebSocket from "../features/DrawingCanvas/hooks/useWebSocket";

export default function usePresence(roomId, me) {
  const [users, setUsers] = useState([]);
  // Step 1: Initial fetch (who is already in the room)
  useEffect(() => {
    fetch(`http://localhost:8080/api/rooms/${roomId}/users`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setUsers)
      .catch(() => {});
  }, [roomId]);

  // Step 2: WebSocket connection
  const { client, connected } = useWebSocket(
    [
      {
        topic: `/topic/room.${roomId}.presence`,
        handler: (message) => {
          const data = JSON.parse(message.body);
          if (data.type === "presence_join") {
            //data.users => [{id1,name1},{id2,name2},....]
            data?.users.forEach((item) => {
              item.type = data.type;
            });
            setUsers(data.users);
          } else if (data.type === "presence_leave") {
            setUsers((s) => {
              return s.map((item) => {
                let found = data.users.some((user) => user.id === item.id);
                return found ? item : { ...item, type: data.type };
              });
            });
          } else if (data.type === "presence_sync") {
            data?.users.forEach((item) => {
              item.type = data.type;
            });
            setUsers(data.users);
          }
        },
      },
    ],
    me,
  );

  // Step 3: Announce myself once connected /app/room/{roomId}/presence.join
  useEffect(() => {
    if (connected) {
      client.publish({
        destination: `/app/room/${roomId}/presence.join`,
        body: JSON.stringify({
          userId: me.id,
          name: me.name,
        }),
      });
    }
    return () => {
      if (client && client.connected) {
        client.publish({
          destination: `/app/room/${roomId}/presence.leave`,
          body: JSON.stringify({
            userId: me.id,
            name: me.name,
          }),
        });
      }
    };
  }, [client, roomId, me.id, me.name, connected]);

  return users;
}

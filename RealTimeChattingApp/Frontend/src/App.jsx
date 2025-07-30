import { useCallback, useMemo, useReducer } from "react";
import useWebSocket from "../hooks/useWebSocket";

const initialState = {
  currMessage: "",
  messages: [],
  username: "User" + Math.floor(Math.random() * 1000),
  isJoined: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "message/typing":
      return { ...state, currMessage: action.payload };
    case "message/received":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "message/sent":
      return {
        ...state,
        currMessage: "",
      };
    case "user/joined":
      return {
        ...state,
        isJoined: true,
      };
    case "username/change":
      return { ...state, username: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}

function App() {
  const [{ messages, currMessage, username, isJoined }, dispatch] = useReducer(
    reducer,
    initialState
  );

  //when function re-renders each time onMessage function is created
  //causing the useEffect inside custom hook(useWebSocket) to run again
  //chances of inifinte loops and performance issues
  const onMessage = useCallback((message) => {
    const { content, sender, type } = JSON.parse(message.body);
    dispatch({
      type: "message/received",
      payload: {
        content,
        sender: sender || "Unknown",
        type: type || "CHAT",
      },
    });
  }, []);

  const topics = useMemo(() => ["/topic/chat"], []);

  const { client, connected } = useWebSocket(topics, onMessage);

  const sendMessage = () => {
    if (connected && client && currMessage.trim()) {
      const messagePayload = {
        content: currMessage,
        sender: username,
        type: "CHAT",
      };

      client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messagePayload),
      });

      //To Clear the type bar
      dispatch({ type: "message/sent" });
    } else {
      console.log(
        "Cannot send message. Connected:",
        connected,
        "Client:",
        client,
        "Message:",
        currMessage
      );
    }
  };

  const joinChat = () => {
    dispatch({ type: "user/joined" });

    if (connected && client) {
      const joinPayload = {
        sender: username,
        type: "JOIN",
      };

      client.publish({
        destination: "/app/chat.joinChat",
        body: JSON.stringify(joinPayload),
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Real-Time Chat</h1>

      <div style={{ marginBottom: "10px" }}>
        <strong>Status: </strong>
        <span style={{ color: connected ? "green" : "red" }}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) =>
            dispatch({ type: "username/change", payload: e.target.value })
          }
          style={{ marginLeft: "10px", marginRight: "10px" }}
        />
        <button onClick={joinChat} disabled={!connected}>
          Join Chat
        </button>
      </div>

      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "5px" }}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={currMessage}
          onChange={(e) =>
            dispatch({ type: "message/typing", payload: e.target.value })
          }
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isJoined || !connected}
          style={{ flex: 1, padding: "5px" }}
        />
        <button onClick={sendMessage} disabled={!isJoined || !connected}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

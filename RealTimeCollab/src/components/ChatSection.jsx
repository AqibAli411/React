import {
  Send,
  Bot,
  Users,
  MoveLeft,
  MoveRight,
  Hash,
  Bell,
  Settings,
} from "lucide-react";
import { memo, useEffect, useState } from "react";

// Sample data - replace with your actual users prop
const sampleUsers = [
  { id: 1, name: "Alice Johnson", type: "joining" },
  { id: 2, name: "Bob Smith", type: "joining" },
  { id: 3, name: "Charlie Brown", type: "leaving" },
  { id: 4, name: "Diana Prince", type: "joining" },
  { id: 5, name: "Eve Wilson", type: "leaving" },
  { id: 6, name: "Frank Miller", type: "joining" },
];

// Sample messages with system notifications
const sampleMessages = [
  {
    id: 1,
    type: "system",
    text: "Alice Johnson joined",
    timestamp: "9:00 AM",
    userId: 1,
  },
  {
    id: 2,
    type: "message",
    text: "Hey everyone! Excited to work on this project together.",
    sender: "Alice Johnson",
    timestamp: "9:02 AM",
    userId: 1,
  },
  {
    id: 3,
    type: "system",
    text: "Bob Smith joined",
    timestamp: "9:15 AM",
    userId: 2,
  },
  {
    id: 4,
    type: "message",
    text: "Good morning team! Let's get started with the wireframes.",
    sender: "Bob Smith",
    timestamp: "9:16 AM",
    userId: 2,
  },
  {
    id: 5,
    type: "message",
    text: "I've uploaded the initial designs to the shared folder. Please review when you get a chance.",
    sender: "Alice Johnson",
    timestamp: "9:45 AM",
    userId: 1,
  },
  {
    id: 6,
    type: "system",
    text: "Charlie Brown left",
    timestamp: "10:30 AM",
    userId: 3,
  },
  {
    id: 7,
    type: "system",
    text: "Diana Prince joined",
    timestamp: "11:00 AM",
    userId: 4,
  },
  {
    id: 8,
    type: "message",
    text: "Hi team! Sorry I'm late. Catching up on the conversation now.",
    sender: "Diana Prince",
    timestamp: "11:05 AM",
    userId: 4,
  },
];

function ChatSection({ users = sampleUsers }) {
  const [newMessage, setNewMessage] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [messages, setMessages] = useState(sampleMessages);
  const [activeUsers, setActiveUsers] = useState([]);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return nameParts[0].charAt(0).toUpperCase();
  };

  // Get user avatar color based on name
  const getUserAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        type: "message",
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        userId: "current-user",
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  const toggleMode = () => {
    setIsAiMode(!isAiMode);
  };

  // Filter active users
  const joiningUsers = sampleUsers.filter((user) => user.type === "joining");
  const onlineCount = joiningUsers.length;

  useEffect(() => {
    setActiveUsers(joiningUsers);
  }, [users]);

  return (
    <div
      className={`flex ${!isCompact ? "flex-1" : ""} border-r border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900`}
    >
      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Compact Mode Users */}
        {isCompact && !isAiMode && (
          <div className="overflow-y-auto p-2">
            <div className="mb-2 flex items-center">
              <button
                onClick={() => setIsCompact(!isCompact)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700"
              >
                {!isCompact ? (
                  <MoveLeft className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                ) : (
                  <MoveRight className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                )}
              </button>
            </div>
            <div className="space-y-3">
              {activeUsers.slice(0, 8).map((user) => (
                <div key={user.id} className="flex justify-center">
                  <div
                    className={`h-10 w-10 rounded-full ${getUserAvatarColor(user.name)} relative flex items-center justify-center text-sm font-medium text-white`}
                  >
                    {getUserInitials(user.name)}
                    <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-neutral-700"></div>
                  </div>
                </div>
              ))}
              {activeUsers.length > 8 && (
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 text-xs font-medium text-white dark:bg-neutral-600">
                    +{activeUsers.length - 8}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Header */}
        {!isCompact && (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsCompact(!isCompact)}
                    className="rounded-lg p-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-700"
                  >
                    {!isCompact ? (
                      <MoveLeft className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                    ) : (
                      <MoveRight className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                    )}
                  </button>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-neutral-100">
                    {isAiMode ? "AI Chat" : "Team Chat"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    {isAiMode ? "" : `${onlineCount} online`}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-neutral-600 dark:bg-neutral-700">
                <button
                  onClick={() => setIsAiMode(false)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    !isAiMode
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Chat
                </button>
                <button
                  onClick={() => setIsAiMode(true)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isAiMode
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-600"
                  }`}
                >
                  <Bot className="h-4 w-4" />
                  AI
                </button>
              </div>
            </div>
            {/* Messages */}
            <div className="space-y-4 overflow-y-auto p-4">
              {!isAiMode ? (
                messages.map((message) => (
                  <div key={message.id}>
                    {message.type === "system" ? (
                      <div className="flex justify-center">
                        <div className="rounded-full bg-gray-100 px-3 py-1 dark:bg-neutral-700">
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            {message.text} • {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <div
                          className={`h-8 w-8 rounded-full ${getUserAvatarColor(message.sender)} flex flex-shrink-0 items-center justify-center text-sm font-medium text-white`}
                        >
                          {message.sender === "You"
                            ? "Y"
                            : getUserInitials(message.sender)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-baseline gap-2">
                            <span className="font-medium text-gray-900 dark:text-neutral-100">
                              {message.sender}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-neutral-400">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="leading-relaxed text-gray-700 dark:text-neutral-300">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Bot className="mb-4 h-16 w-16 text-blue-500" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-neutral-100">
                    AI Assistant Ready
                  </h3>
                  <p className="mb-4 text-gray-500 dark:text-neutral-400">
                    Ask me anything about your project or get help with
                    collaboration.
                  </p>
                  <div className="space-y-2 text-sm text-gray-400 dark:text-neutral-500">
                    <p>• Generate ideas and suggestions</p>
                    <p>• Help with project planning</p>
                    <p>• Answer questions about collaboration</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      isAiMode ? "Ask AI assistant..." : "Type a message..."
                    }
                    rows="1"
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`rounded-lg p-3 transition-all duration-200 ${
                    newMessage.trim()
                      ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600 hover:shadow-md"
                      : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-neutral-700 dark:text-neutral-500"
                  }`}
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(ChatSection);

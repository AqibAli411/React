import {
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Bot,
  Users,
} from "lucide-react";
import { useState } from "react";

const contacts = [
  {
    id: 1,
    name: "Ahmed Ali",
    img: "p1.jpg",
    lastMsg: "Hey, how are you doing today?",
    time: "10:45",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        text: "Hey, how are you doing today?",
        sender: "contact",
        time: "10:40",
      },
      {
        id: 2,
        text: "I'm doing great! Just finished my workout 💪",
        sender: "me",
        time: "10:42",
      },
      {
        id: 3,
        text: "That's awesome! I should start working out too",
        sender: "contact",
        time: "10:45",
      },
    ],
  },
  {
    id: 2,
    name: "Sara Khan",
    img: "p2.jpg",
    lastMsg: "Let's meet tomorrow ☕",
    time: "09:30",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        text: "Hey! Are you free tomorrow?",
        sender: "contact",
        time: "09:20",
      },
      { id: 2, text: "Yes, what's up?", sender: "me", time: "09:25" },
      {
        id: 3,
        text: "Let's meet tomorrow at the coffee shop ☕",
        sender: "contact",
        time: "09:30",
      },
    ],
  },
  {
    id: 3,
    name: "Usman Malik",
    img: "p3.jpg",
    lastMsg: "Project is ready! 🚀",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        text: "How's the project coming along?",
        sender: "me",
        time: "Yesterday",
      },
      {
        id: 2,
        text: "Almost done! Just fixing bugs",
        sender: "contact",
        time: "Yesterday",
      },
      {
        id: 3,
        text: "Project is ready for review! 🚀",
        sender: "contact",
        time: "Yesterday",
      },
    ],
  },
];

const aiChat = {
  id: "ai",
  name: "AI Assistant",
  img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&crop=center",
  lastMsg: "How can I help you today?",
  time: "Now",
  unread: 0,
  online: true,
  messages: [
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "contact",
      time: "Now",
    },
    {
      id: 2,
      text: "Hi! Can you help me with some questions?",
      sender: "me",
      time: "Now",
    },
    {
      id: 3,
      text: "Absolutely! I'm here to help with anything you need.",
      sender: "contact",
      time: "Now",
    },
  ],
};

function ChatSection() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleBackToChats = () => {
    setSelectedUser(null);
  };

  const toggleMode = () => {
    setIsAiMode(!isAiMode);
    setSelectedUser(null);
  };

  const currentChats = isAiMode ? [aiChat] : contacts;

  return (
    <div className="mx-auto flex h-screen max-h-[600px] max-w-md bg-white shadow-xl">
      {/* Sidebar */}
      <div
        className={`${selectedUser ? "hidden" : "flex"} w-full flex-col bg-gray-50 p-2`}
      >
        {/* Header */}
        <div className="rounded-xl bg-blue-400 p-4 text-white">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Messages</h1>
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          {/* AI/Users Toggle */}
          <div className="flex rounded-lg bg-white/20 p-1">
            <button
              onClick={() => setIsAiMode(false)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                !isAiMode
                  ? "bg-white text-blue-600"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              Chats
            </button>
            <button
              onClick={() => setIsAiMode(true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isAiMode
                  ? "bg-white text-blue-600"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Bot className="h-4 w-4" />
              AI Chat
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {currentChats.map((person) => (
            <div
              key={person.id}
              onClick={() => setSelectedUser(person)}
              className="flex cursor-pointer items-center gap-3 border-b border-gray-200 p-4 transition-colors hover:bg-white"
            >
              {/* Profile Image */}
              <div className="relative">
                <div
                  className={`${isCompact ? "h-8 w-8" : "h-12 w-12"} overflow-hidden rounded-full`}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={person.img}
                    alt={person.name}
                  />
                </div>
                {person.online && (
                  <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400"></div>
                )}
              </div>

              {/* Chat Info */}
              {!isCompact && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium text-gray-900">
                      {person.name}
                    </p>
                    <span className="text-xs text-gray-500">{person.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-gray-600">
                      {person.lastMsg}
                    </p>
                    {person.unread > 0 && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                        {person.unread}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedUser && (
        <div className="flex w-full flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4">
            <button
              onClick={handleBackToChats}
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>

            <div className="h-10 w-10 overflow-hidden rounded-full">
              <img
                className="h-full w-full object-cover"
                src={selectedUser.img}
                alt={selectedUser.name}
              />
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{selectedUser.name}</p>
              <p className="text-xs text-gray-500">
                {selectedUser.online ? "Online" : "Last seen recently"}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
                <Video className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {selectedUser.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 ${
                      message.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <p className="text-sm break-all">{message.text}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.sender === "me"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-3 border-t border-gray-200 bg-white p-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`rounded-full p-2 transition-all ${
                newMessage.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-300 text-gray-500"
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatSection;

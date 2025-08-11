import {
  Send,
  ArrowLeft,
  Phone,
  Video,
  Bot,
  Users,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { memo, useState } from "react";

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
    <div className="mx-auto flex border-r border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Sidebar */}
      <div
        className={`flex flex-col ${isCompact ? "items-center" : ""} overflow-hidden bg-gray-50 transition-all duration-300 ease-in-out dark:bg-neutral-900 ${
          selectedUser ? "hidden" : isCompact ? "mt-2 w-17" : "w-85 p-2"
        }`}
      >
        {/* Header */}
        <div
          className={`flex flex-col gap-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out dark:from-blue-600 dark:to-blue-700 ${
            !isCompact ? "p-4" : "self-center p-2"
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompact(!isCompact)}
              className="rounded-lg bg-white/20 p-2 transition-all duration-200 hover:scale-105 hover:bg-white/30 active:scale-95"
            >
              {!isCompact ? (
                <MoveLeft className="h-5 w-5" />
              ) : (
                <MoveRight className="h-5 w-5" />
              )}
            </button>
            {!isCompact && <h1 className="text-xl font-semibold">Messages</h1>}
          </div>

          {/* AI/Users Toggle */}
          {!isCompact && (
            <div className="flex rounded-lg bg-white/10 p-1 backdrop-blur-sm">
              <button
                onClick={() => setIsAiMode(false)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  !isAiMode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4" />
                Chats
              </button>
              <button
                onClick={() => setIsAiMode(true)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isAiMode
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Bot className="h-4 w-4" />
                AI Chat
              </button>
            </div>
          )}
        </div>

        {/* Chat List */}
        <div className="mt-2 flex-1 overflow-y-auto">
          {currentChats.map((person) => (
            <div
              key={person.id}
              onClick={() => setSelectedUser(person)}
              className="group m-1 flex cursor-pointer items-center gap-3 rounded-lg border-b border-gray-100 p-3 transition-all duration-200 hover:bg-white hover:shadow-sm active:scale-[0.98] dark:border-neutral-800 dark:hover:bg-neutral-800"
            >
              {/* Profile Image */}
              <div className="relative">
                <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-gray-100 transition-all duration-200 group-hover:ring-blue-200 dark:ring-neutral-700 dark:group-hover:ring-blue-500/30">
                  <img
                    className="h-full w-full object-cover"
                    src={person.img}
                    alt={person.name}
                  />
                </div>
                {person.online && (
                  <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400 dark:border-neutral-900"></div>
                )}
              </div>

              {/* Chat Info */}
              {!isCompact && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {person.name}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-neutral-400">
                      {person.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-gray-600 dark:text-neutral-300">
                      {person.lastMsg}
                    </p>
                    {person.unread > 0 && (
                      <span className="ml-2 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-blue-500 text-xs text-white">
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
        <div className="flex w-full flex-col bg-white dark:bg-neutral-900">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white p-4 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/50">
            <button
              onClick={handleBackToChats}
              className="rounded-full p-2 transition-all duration-200 hover:bg-gray-100 active:scale-90 dark:hover:bg-neutral-700"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
            </button>

            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-neutral-600">
              <img
                className="h-full w-full object-cover"
                src={selectedUser.img}
                alt={selectedUser.name}
              />
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedUser.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                {selectedUser.online ? (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                    Online
                  </span>
                ) : (
                  "Last seen recently"
                )}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-gray-100 active:scale-95 dark:hover:bg-neutral-700">
                <Phone className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
              </button>
              <button className="rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-gray-100 active:scale-95 dark:hover:bg-neutral-700">
                <Video className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-neutral-900">
            <div className="space-y-4">
              {selectedUser.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`animate-in slide-in-from-bottom-5 flex duration-300 ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                      message.sender === "me"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "border border-gray-100 bg-white text-gray-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.text}
                    </p>
                    <p
                      className={`mt-2 text-xs ${
                        message.sender === "me"
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-neutral-400"
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
          <div className="flex items-center gap-3 border-t border-gray-200 bg-white p-4 backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-800/50">
            <div className="relative flex-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="w-full rounded-full border border-gray-200 bg-gray-100 px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-400"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`transform rounded-full p-3 transition-all duration-200 ${
                newMessage.trim()
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:scale-110 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/25 active:scale-95"
                  : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-neutral-600 dark:text-neutral-400"
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

export default memo(ChatSection);

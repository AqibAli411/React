import React, { useState, useRef } from "react";

// RealScribeApp.jsx
// Single-file React + Tailwind layout for a realtime-collab app
// - Left collapsible chat & AI assistant sidebar
// - Main area: Canvas or Rich Text Editor with toolbar
// - Top bar with mode toggle, theme, profile
// - Right utility drawer with collaborators and attachments
// This file is purely presentational. You can wire functionality later.

export default function RealScribeApp() {
  // ----- UI state -----
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [mode, setMode] = useState("canvas"); // 'canvas' or 'text'

  const [activeTab, setActiveTab] = useState("chat"); // 'chat' or 'ai'
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [penSize, setPenSize] = useState(4);
  const [tool, setTool] = useState("pen"); // 'pen' or 'eraser'
  const [dark, setDark] = useState(false);
  const canvasRef = useRef(null);

  const dummyChats = [
    { id: 1, name: "Ahmed Ali", last: "Hey How are you", avatar: "A" },
    { id: 2, name: "Sara Khan", last: "On my way", avatar: "S" },
    { id: 3, name: "Zaid", last: "Let's draw this", avatar: "Z" },
  ];

  const messages = [
    { id: 1, from: "me", text: "Hey How are you" },
    { id: 2, from: "them", text: "Fine What about you?" },
  ];

  // Presentational handlers (no drawing logic included)
  const toggleMode = () => setMode(mode === "canvas" ? "text" : "canvas");
  const toggleTheme = () => setDark((s) => !s);
  const toggleLeft = () => setLeftOpen((s) => !s);
  const toggleRight = () => setRightOpen((s) => !s);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 font-bold text-white">
                RS
              </div>
              <div>
                <div className="font-semibold">RealScribe</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Realtime Collab — Canvas & Text
                </div>
              </div>
            </div>
          </div>

          {/* Mode toggle (also in center) */}
          <div className="ml-4 hidden items-center gap-2 md:flex">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Mode
            </span>
            <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-700">
              <button
                onClick={() => setMode("canvas")}
                className={`rounded-full px-3 py-1 text-sm ${mode === "canvas" ? "bg-white shadow dark:bg-gray-800" : "text-gray-500"}`}
              >
                Canvas
              </button>
              <button
                onClick={() => setMode("text")}
                className={`rounded-full px-3 py-1 text-sm ${mode === "text" ? "bg-white shadow dark:bg-gray-800" : "text-gray-500"}`}
              >
                Text
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {dark ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.08 18.08l.7.7M1 12h1M22 12h1M4.22 19.78l.7-.7M18.08 5.92l.7-.7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
                Aqib Ali
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-orange-400 font-semibold">
                AA
              </div>
            </div>
          </div>
        </header>

        

        <div className="flex h-[calc(100vh-64px)]">
          {/* 64px header */}

          {/* Left Sidebar: Chat + AI Assistant */}
          <aside
            className={`flex-shrink-0 transition-all duration-300 ${leftOpen ? "w-72" : "w-16"} flex flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
          > 
            
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 dark:border-gray-700">
              <div className="flex items-center gap-2">
                
                {/* here is the left bar closing button */}
                <button
                  onClick={toggleLeft}
                  className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6h16M4 12h16M4 18h16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                
                {leftOpen && (
                  <div className="text-sm font-medium">Chat Section</div>
                )}
              </div>
              {/* Small new chat / AI toggle */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`rounded p-1 ${activeTab === "chat" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                  title="Chats"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`rounded p-1 ${activeTab === "ai" ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                  title="AI Assistant"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search (only when expanded) */}
            {leftOpen && (
              <div className="px-3 py-2">
                <input
                  className="w-full rounded-full bg-gray-100 px-3 py-2 text-sm outline-none dark:bg-gray-700"
                  placeholder="Search chats or AI..."
                />
              </div>
            )}

            <div className="flex-1 overflow-auto">
              {activeTab === "chat" ? (
                <div>
                  {/* Contacts list */}
                  <div className="space-y-2 px-3 py-2">
                    {dummyChats.map((c) => (
                      <div
                        key={c.id}
                        className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold dark:bg-gray-700">
                          {c.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {c.last}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">2m</div>
                      </div>
                    ))}
                  </div>

                  {/* Conversation preview (static) */}
                  <div className="px-3 py-2">
                    <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-gray-900">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`mb-3 flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`${m.from === "me" ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl bg-indigo-500 text-white" : "rounded-tl-xl rounded-tr-xl rounded-br-xl bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"} max-w-xs px-4 py-2`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <div className="rounded-lg bg-gradient-to-br from-pink-50 to-yellow-50 p-3 dark:from-pink-900 dark:to-yellow-900">
                    <div className="text-sm font-semibold">AI Assistant</div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">
                      Ask the AI to summarize, generate ideas, or join the
                      canvas session as an automated helper.
                    </div>
                    <div className="mt-3">
                      <textarea
                        className="h-24 w-full rounded-md bg-white p-2 text-sm dark:bg-gray-800"
                        placeholder="Ask something to AI... (UI only)"
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button className="rounded-md bg-indigo-500 px-3 py-1 text-sm text-white">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message input (only when expanded) */}
            {leftOpen && (
              <div className="border-t border-gray-100 px-3 py-3 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm outline-none dark:bg-gray-700"
                    placeholder="Write a Message"
                  />
                  <button className="rounded-full bg-indigo-500 p-2 text-white">
                    ➤
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* Main Area */}
          <main className="flex flex-1 flex-col">
            {/* Canvas/Text toolbar */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTool("pen")}
                    className={`rounded-md p-2 ${tool === "pen" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    title="Pen"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 21l3-1 11-11a4 4 0 10-5.7-5.7L6.3 14.3 5 18l-2 3z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setTool("eraser")}
                    className={`rounded-md p-2 ${tool === "eraser" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                    title="Eraser"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14.121 14.121L21 7.242a2 2 0 000-2.828L19.586 2.2a2 2 0 00-2.828 0L7.2 11.758"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Color and size controls */}
                  <div className="flex items-center gap-2 px-2">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="h-8 w-8 border-0 p-0"
                      title="Pen color"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="40"
                        value={penSize}
                        onChange={(e) => setPenSize(Number(e.target.value))}
                      />
                      <div className="w-8 text-center text-xs">{penSize}</div>
                    </div>
                  </div>

                  <div className="ml-3 hidden items-center gap-2 sm:flex">
                    <button className="rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
                      Undo
                    </button>
                    <button className="rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
                      Redo
                    </button>
                    <button className="rounded-md bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
                      Import
                    </button>
                    <button className="rounded-md bg-indigo-500 px-3 py-1 text-sm text-white">
                      Save
                    </button>
                  </div>
                </div>

                {/* Mode switch for canvas/text editor (redundant but handy) */}
                <div className="ml-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={mode === "text"}
                      onChange={toggleMode}
                      className="form-checkbox h-4 w-4"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-300">
                      Open Text Editor
                    </span>
                  </label>
                </div>
              </div>

              {/* Right side of toolbar */}
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Zoom: 100%
                </div>
                <button
                  onClick={toggleRight}
                  className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Toggle Drawer
                </button>
              </div>
            </div>

            {/* Main canvas or text editor area */}
            <div className="flex flex-1 overflow-hidden">
              <div className="relative flex-1">
                {/* Canvas placeholder */}
                {mode === "canvas" ? (
                  <div className="h-full w-full bg-white dark:bg-gray-900">
                    <canvas ref={canvasRef} className="bg-grid h-full w-full" />

                    {/* Floating minimap / info */}
                    <div className="absolute top-4 right-4 rounded-md bg-white px-3 py-1 text-xs shadow dark:bg-gray-800">
                      Zoom: 100% &nbsp; Strokes: 0
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full bg-white p-6 dark:bg-gray-900">
                    <div
                      contentEditable
                      className="h-full overflow-auto text-gray-900 outline-none dark:text-gray-100"
                      suppressContentEditableWarning
                    >
                      <h1 className="text-2xl font-bold">Session Notes</h1>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        This is a rich text editor placeholder. Use formatting
                        toolbar to style content (UI only).
                      </p>

                      <p className="mt-4">Start typing here...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right utility drawer */}
              <aside
                className={`transition-all duration-300 ${rightOpen ? "w-72" : "w-0"} overflow-hidden border-l border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
              >
                {rightOpen && (
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                      <div className="font-medium">Session</div>
                      <button
                        onClick={toggleRight}
                        className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex-1 space-y-4 overflow-auto p-4">
                      <div>
                        <div className="text-xs text-gray-500">
                          Collaborators
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                              AK
                            </div>
                            <div className="flex-1 text-sm">
                              Ahmed Ali{" "}
                              <div className="text-xs text-gray-400">Owner</div>
                            </div>
                            <div className="text-xs text-green-500">Online</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                              S
                            </div>
                            <div className="flex-1 text-sm">
                              Sara Khan{" "}
                              <div className="text-xs text-gray-400">
                                Editor
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">Idle</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Attachments</div>
                        <div className="mt-2">
                          <div className="rounded-md border border-dashed border-gray-200 p-2 text-sm dark:border-gray-700">
                            Drop files here or click to upload (UI only)
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500">Notes</div>
                        <textarea
                          className="mt-2 h-24 w-full rounded-md bg-gray-100 p-2 text-sm dark:bg-gray-700"
                          placeholder="Private notes"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </main>
        </div>
      </div>

      {/* small styles for grid background - put into your global CSS or Tailwind config */}
      <style>{`
        /* A simple grid background for canvas area (pure CSS) */
        .bg-grid {
          background-image: linear-gradient(0deg, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Dark mode tweak */
        .dark .bg-grid {
          background-image: linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}

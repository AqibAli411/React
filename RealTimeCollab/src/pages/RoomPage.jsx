import React, { useState, useEffect } from "react";
import {
  Clipboard,
  Check,
  ArrowLeft,
  Sun,
  Moon,
  Users,
  Plus,
  LogIn,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RoomPage() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nameError, setNameError] = useState("");
  const [roomIdError, setRoomIdError] = useState("");

  const navigate = useNavigate();

  // Auto-generate room ID when switching to create mode
  useEffect(() => {
    if (isCreating && !roomId) {
      generateRoomId();
    }
  }, [isCreating, roomId]);

  const generateRoomId = async () => {
    setIsGenerating(true);
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setCopied(false);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const validateName = (value) => {
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateRoomId = (value) => {
    if (!value.trim()) {
      setRoomIdError("Room ID is required");
      return false;
    }
    if (value.trim().length !== 6) {
      setRoomIdError("Room ID must be 6 characters");
      return false;
    }
    setRoomIdError("");
    return true;
  };

  function randomNumber() {
    return Math.round(Math.random() * 1000 + 1);
  }

  const url = "http://localhost:8080/api/room";

  //handles create functionality of rooom
  const handleCreate = async () => {
    if (!validateName(name)) return;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: roomId,
        userid: randomNumber(),
        username: name,
      }),
    });

    const { id, username, userid } = await response.json();

    navigate(`/room/${id}?name=${username}&id=${userid}`);
    // Add success animation or navigation here
  };

  
  //handles join functionality of rooom
  const handleJoin = async () => {
    if (!validateName(name) || !validateRoomId(joinRoomId)) return;

    try {
      const response = await fetch(`${url}/${joinRoomId}`);

      if (!response.ok) throw new Error("Room cannot be found!");

      const { id, userid } = await response.json();

      navigate(`/room/${id}?name=${name}&id=${randomNumber()}`);
    } catch (err) {
      console.log(err);
    }
  };



  const handleBack = () => {
    navigate(-1);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleModeSwitch = (creating) => {
    setIsCreating(creating);
    setNameError("");
    setRoomIdError("");
    if (creating && !roomId) {
      generateRoomId();
    }
  };

  const themeClasses = isDarkMode
    ? "bg-neutral-900"
    : "bg-gradient-to-br from-blue-50 via-white to-neutral-50";


  const inputClasses = isDarkMode
    ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-blue-400 focus:bg-slate-700"
    : "bg-white/70 border-slate-200 text-slate-800 placeholder-slate-500 focus:border-blue-400 focus:bg-white";

  const buttonPrimaryClasses = isDarkMode
    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25"
    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25";

  const buttonSecondaryClasses = isDarkMode
    ? "bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-300 border-neutral-600/50"
    : "bg-neutral-100/50 hover:bg-neutral-200/50 text-neutral-600 border-neutral-300/50";

  const toggleActiveClasses = isDarkMode
    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25";

  const toggleInactiveClasses = isDarkMode
    ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/30"
    : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100/50";

  const roomIdCardClasses = isDarkMode
    ? "bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 border-neutral-600/30"
    : "bg-gradient-to-r from-blue-50/50 to-neutral-50/50 border-blue-200/30";

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-8 ${themeClasses}`}
    >
     

      {/* Header Controls */}
      <div className="absolute top-6 right-6 left-6 z-10 flex items-center justify-between">
        <button
          onClick={handleBack}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-medium transition-all duration-200 ${buttonSecondaryClasses} hover:scale-105`}
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-medium transition-all duration-200 ${buttonSecondaryClasses} hover:scale-105`}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          {isDarkMode ? "Light" : "Dark"}
        </button>
      </div>

      {/* Main Card */}
      <div
        className={`relative w-full max-w-lg rounded-3xl p-8 border border-gray-300`}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div
            className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${isDarkMode ? "bg-blue-500/20" : "bg-blue-100"}`}
          >
            <Users
              className={`h-8 w-8 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            />
          </div>
          <h1
            className={`mb-2 text-3xl font-bold ${isDarkMode ? "text-white" : "text-neutral-800"}`}
          >
            {isCreating ? "Create Room" : "Join Room"}
          </h1>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex rounded-2xl bg-neutral-100/50 p-1 dark:bg-neutral-700/50">
          <button
            onClick={() => handleModeSwitch(true)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
              isCreating ? toggleActiveClasses : toggleInactiveClasses
            }`}
          >
            <Plus size={18} />
            Create
          </button>
          <button
            onClick={() => handleModeSwitch(false)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
              !isCreating ? toggleActiveClasses : toggleInactiveClasses
            }`}
          >
            <LogIn size={18} />
            Join
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Name Input */}
          <div>
            <label
              className={`mb-3 block text-sm font-semibold ${isDarkMode ? "text-neutral-200" : "text-neutral-700"}`}
            >
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) validateName(e.target.value);
              }}
              onBlur={() => validateName(name)}
              className={`w-full rounded-2xl border-2 px-4 py-4 font-medium transition-all duration-200 ${inputClasses} ${
                nameError
                  ? "border-red-400 focus:border-red-400"
                  : "focus:ring-4 focus:ring-blue-500/10"
              }`}
              placeholder="Enter your display name"
            />
            {nameError && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                <span className="h-1 w-1 rounded-full bg-red-500"></span>
                {nameError}
              </p>
            )}
          </div>

          {isCreating ? (
            <>
              {/* Generated Room ID */}
              <div>
                <label
                  className={`mb-3 block text-sm font-semibold ${isDarkMode ? "text-neutral-200" : "text-neutral-700"}`}
                >
                  Room ID
                </label>
                <div
                  className={`rounded-2xl border-2 p-4 ${roomIdCardClasses}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {isGenerating ? (
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                          <span
                            className={`text-sm ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
                          >
                            Generating...
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-500" />
                            <span
                              className={`text-xs font-medium tracking-wider uppercase ${isDarkMode ? "text-neutral-400" : "text-neutral-500"}`}
                            >
                              Your Room Code
                            </span>
                          </div>
                          <div className="font-mono text-2xl font-bold tracking-widest text-blue-600">
                            {roomId}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={generateRoomId}
                        disabled={isGenerating}
                        className={`rounded-xl p-3 transition-all duration-200 ${buttonSecondaryClasses} hover:scale-105 disabled:opacity-50`}
                        title="Generate new ID"
                      >
                        <Sparkles size={16} />
                      </button>
                      <button
                        onClick={copyToClipboard}
                        disabled={isGenerating}
                          className={`rounded-xl p-3 transition-all duration-200 ${
                          copied
                            ? "bg-green-500 text-white"
                            : buttonSecondaryClasses
                        } hover:scale-105 disabled:opacity-50`}
                        title={copied ? "Copied!" : "Copy to clipboard"}
                      >
                        {copied ? <Check size={16} /> : <Clipboard size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={isGenerating || !name.trim()}
                className={`w-full rounded-2xl py-4 font-semibold text-white transition-all duration-200 ${buttonPrimaryClasses} hover:-tranneutral-y-0.5 disabled:hover:tranneutral-y-0 cursor-pointer hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  Create Room
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Join Room ID Input */}
              <div>
                <label
                  className={`mb-3 block text-sm font-semibold ${isDarkMode ? "text-neutral-200" : "text-neutral-700"}`}
                >
                  Room ID
                </label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => {
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setJoinRoomId(value.slice(0, 6));
                    if (roomIdError) validateRoomId(value);
                  }}
                  onBlur={() => validateRoomId(joinRoomId)}
                  className={`w-full rounded-2xl border-2 px-4 py-4 text-center font-mono text-lg tracking-widest transition-all duration-200 ${inputClasses} ${
                    roomIdError
                      ? "border-red-400 focus:border-red-400"
                      : "focus:ring-4 focus:ring-blue-500/10"
                  }`}
                  placeholder="XXXXXX"
                  maxLength={6}
                />
                {roomIdError && (
                  <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                    <span className="h-1 w-1 rounded-full bg-red-500"></span>
                    {roomIdError}
                  </p>
                )}
              </div>

              <button
                onClick={handleJoin}
                disabled={!name.trim() || !joinRoomId.trim()}
                className={`w-full rounded-2xl py-4 font-semibold text-white transition-all duration-200 ${buttonPrimaryClasses} hover:-tranneutral-y-0.5 disabled:hover:tranneutral-y-0 cursor-pointer hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Users size={20} />
                  Join Room
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

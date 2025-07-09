import React, { useState, useRef, useEffect } from "react";
import axios from "axios";


const Chatbot = () => {
  const backend_url = import.meta.env.VITE_BACKEND_URL
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Welcome to ArogyaBridge! I'm your healthcare buddy 🤝. Ask me about your medical records, prescriptions, or some healthy life tips! 🌱",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${backend_url}/api/chatbot`, { message: input });

      const botMsg = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);

      
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Sorry, I couldn't process your request. Try again later!" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="fixed bottom-8  animate-bounce right-8 z-50 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-full shadow-lg p-4 hover:scale-110 transition-transform"
        onClick={() => setOpen(!open)}
        aria-label="Open Chatbot"
      >
        <span className="text-3xl">💬</span>
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-8 z-50 w-80 max-w-xs bg-white rounded-2xl shadow-xl border border-teal-300 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-2xl px-4 py-3 flex justify-between items-center">
            <span className="font-bold">ArogyaBridge Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-xl font-bold hover:text-red-200">&times;</button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50" style={{ maxHeight: 300 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-xl text-sm shadow ${
                    msg.from === "user"
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-2 border-t flex gap-2 bg-white">
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button
              className={`bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

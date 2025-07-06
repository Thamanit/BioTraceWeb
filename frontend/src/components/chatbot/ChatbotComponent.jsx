import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";
import { getApiURL } from "../../lib/route";

const ChatbotComponent = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! How can I assist you today?", sender: "bot", loading: false },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => setOpen(!open);
    const chatContainerRef = useRef(null); // 1️⃣ Create ref

    const sendMessage = async () => {
        if (!input.trim()) return; // Prevent empty messages
        if (loading) return;

        const userMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Mock AI Response with a delay
        setLoading(true);
        const loadResponse = { text: `Thinking...`, sender: "bot", loading: true };
        setMessages((prev) => [...prev, loadResponse]);

        try {
            const response = await axios.post(getApiURL() + '/chatbot', {
                query: input
            }, {
                withCredentials: true
            })

            if (response.status === 200) {
                const botResponse = { text: response.data?.response, sender: "bot", loading: false };
                setMessages((prev) => {
                    prev[prev.length - 1] = botResponse
                    return prev;
                })
            }
        }
        catch {
            const botResponse = { text: "failed to chat with Chatbot", sender: "bot", loading: false };
            setMessages((prev) => {
                prev[prev.length - 1] = botResponse
                return prev;
            })
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="fixed z-[999] right-6 bottom-6 flex flex-col items-end">
            {open && (
                <div className="bg-white shadow-lg rounded-lg border border-gray-200 w-[350px] h-[500px] flex flex-col">
                    {/* Close Button */}
                    <button
                        onClick={toggleOpen}
                        className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Chat Header */}
                    <div className="p-4 border-b bg-gray-100 text-lg font-semibold text-gray-800">
                        Depaspace Chatbot
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user"
                                    ? "bg-blue-500 text-white self-end ml-auto"
                                    : "bg-gray-200 text-gray-800 self-start"
                                    }`}
                            >
                                {msg.sender === 'bot' ? msg.text.split('</think>')[1] || msg.text : msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t p-2 flex items-center gap-2 bg-gray-50">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                            className="flex-1 p-2 border rounded-lg outline-none focus:ring focus:ring-red-300"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* {!open && (
                <button
                    onClick={toggleOpen}
                    className="bg-orange-500 text-white p-4 rounded-full shadow-md hover:bg-orange-600 transition-all duration-300"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )} */}
        </div>
    );
};

export default ChatbotComponent;
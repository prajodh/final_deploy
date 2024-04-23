import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ChatIcon } from '@heroicons/react/outline';

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const { currUser } = useSelector((state) => state.user_mod);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmitChat = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;
  
    const newMessage = { role: 'user', content: userInput };
    setChatHistory(prevChatHistory => [...prevChatHistory, newMessage]);
  
    try {
      const response = await fetch('/api/v1/chatbot/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currUser?.data?.token}`
        },
        body: JSON.stringify({ message: userInput })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }
  
      const data = await response.json();
      const botResponse = { role: 'bot', content: data.data || "No response from server" };
      setChatHistory(prevChatHistory => [...prevChatHistory, botResponse]);
      setUserInput('');
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
      const errorMessage = { role: 'bot', content: 'Error communicating with the chatbot.' };
      setChatHistory(prevChatHistory => [...prevChatHistory, errorMessage]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <>
      <button
        className={`fixed bottom-16 right-10 z-30 bg-white hover:bg-grey-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition duration-300 transform ${showChat ? "rotate-45" : ""}`}
        onClick={() => setShowChat(!showChat)}
      >
        <ChatIcon className="h-6 w-6 text-black" />
      </button>

      {showChat && (
        <form className="fixed bottom-20 right-10 w-96 h-96 bg-white shadow-lg p-4 rounded-lg z-20 flex flex-col" onSubmit={handleSubmitChat}>
          <div className="bg-black text-white px-4 py-2 mb-2 rounded-t-lg">
            <h2 className="text-xl font-bold">Chatbot</h2>
          </div>
          <div className="overflow-auto h-52 mb-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`p-2 text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.content}
              </div>
            ))}
            {/* Scroll to this div when a new message is added */}
            <div ref={messagesEndRef} />
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="border p-1 w-full rounded"
          />
          <button type="submit" className="mt-2 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full">
            Send
          </button>
        </form>
      )}
    </>
  );
}

export default Chatbot;

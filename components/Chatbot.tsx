
import React, { useState, useRef, useEffect } from 'react';
import { ChatIcon } from './icons/ChatIcon';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage, Train } from '../types';

interface ChatbotProps {
    trainContext?: Train[];
}

export const Chatbot: React.FC<ChatbotProps> = ({ trainContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am RailConnect AI. How can I help you with your train booking today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '', isLoading: true }]);
    setUserInput('');

    try {
        const botResponseText = await getChatbotResponse(userInput, trainContext);
        const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = botMessage;
            return newMessages;
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: ChatMessage = { sender: 'bot', text: "Sorry, I'm having some trouble right now." };
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = errorMessage;
            return newMessages;
        });
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open chat assistant"
        >
          <ChatIcon className="h-8 w-8" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ease-out">
          <header className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">RailConnect AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-xl font-bold">&times;</button>
          </header>
          
          <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse delay-150"></div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700">
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

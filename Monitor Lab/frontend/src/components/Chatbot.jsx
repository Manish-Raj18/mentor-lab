import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../css_files/chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Mentor Lab Assistant</span>
            <button className="chat-close" onClick={() => setIsOpen(false)}>&times;</button>
          </div>
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble bot typing">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
            />
            <button className="send-btn" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}

      <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
};

export default Chatbot;

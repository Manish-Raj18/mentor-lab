import React, { useState } from 'react';
import axios from 'axios';
import '../css_files/chatbot.css'; // Assuming we'll create this

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      setMessages([...newMessages, { role: 'bot', content: response.data.reply }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { role: 'bot', content: 'Sorry, I am having trouble connecting.' }]);
    }
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>Chat</button>
      {isOpen && (
        <div className="chat-window">
          <div className="messages">
            {messages.map((m, i) => <p key={i} className={m.role}>{m.content}</p>)}
          </div>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
          <button onClick={handleSend}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

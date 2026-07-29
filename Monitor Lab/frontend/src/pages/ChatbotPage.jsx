import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css_files/chatbot.css';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = useCallback((text, index) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*(.*?)\*\*/g, '$1'));
    utterance.lang = 'hi-IN';
    utterance.rate = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }, [speakingIndex]);

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
    <div className="chatbot-page">
      <div className="chatbot-page-bg">MENTOR LAB</div>
      <div className="chatbot-page-container">
        <div className="chatbot-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span className="header-title">Mentor Lab Assistant</span>
          <div className="header-spacer" />
        </div>
        <div className="chatbot-page-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.role === 'bot' && <span className="bot-avatar">🤖</span>}
              <div className="bubble-content">
                <span>{m.content}</span>
              </div>
              {m.role === 'bot' && (
                <button
                  className={`speak-btn ${speakingIndex === i ? 'speaking' : ''}`}
                  onClick={() => speakText(m.content, i)}
                  title={speakingIndex === i ? 'Stop' : 'Listen'}
                >
                  {speakingIndex === i ? '⏹' : '🔊'}
                </button>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble bot typing">
              <span className="bot-avatar">🤖</span>
              <div className="bubble-content typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-page-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <button className="send-btn" onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

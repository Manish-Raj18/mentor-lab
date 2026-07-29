import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css_files/chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [language, setLanguage] = useState('english');
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        setVoicesLoaded(true);
        window.speechSynthesis.getVoices();
      };
      const prime = new SpeechSynthesisUtterance('');
      prime.volume = 0;
      window.speechSynthesis.speak(prime);
    }
  }, []);

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

    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.volume = 1;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [speakingIndex, language]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input, language });
      setMessages(prev => [...prev, { role: 'bot', content: response.data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const openFullscreen = () => {
    navigate('/chatbot');
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>Mentor Lab Assistant</span>
            <div className="header-right">
              <select className="lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="english">English</option>
                <option value="hindi">हिन्दी</option>
              </select>
              <button className="chat-expand" onClick={openFullscreen} title="Open full screen">⛶</button>
              <button className="chat-close" onClick={() => setIsOpen(false)}>&times;</button>
            </div>
          </div>
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <span className="bubble-text">{m.content}</span>
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
              <div className="chat-bubble bot typing">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'hindi' ? 'अपना संदेश लिखें...' : 'Type a message...'}
            />
            <button className="send-btn" onClick={handleSend}>➤</button>
          </div>
        </div>
      )}

      <button className="chat-fab" onClick={openFullscreen} title="Open Mentor Lab Assistant">
        💬
      </button>
    </div>
  );
};

export default Chatbot;

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
  const [language, setLanguage] = useState('english');
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakText = useCallback(async (text, index) => {
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');

    if (speakingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      } else {
        window.speechSynthesis.cancel();
      }
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSpeakingIndex(index);

    if (language === 'hindi') {
      try {
        const res = await axios.post('http://localhost:5000/api/ai/tts', { text: cleanText, lang: 'hindi' }, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { setSpeakingIndex(null); URL.revokeObjectURL(url); audioRef.current = null; };
        audio.onerror = () => { setSpeakingIndex(null); URL.revokeObjectURL(url); audioRef.current = null; };
        audio.play().catch(() => setSpeakingIndex(null));
      } catch {
        setSpeakingIndex(null);
      }
    } else {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
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

  return (
    <div className="chatbot-page">
      <div className="chatbot-page-bg">MENTOR LAB</div>
      <div className="chatbot-page-container">
        <div className="chatbot-page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span className="header-title">Mentor Lab Assistant</span>
          <select className="lang-select lang-select-header" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">हिन्दी</option>
          </select>
        </div>
        <div className="chatbot-page-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`}>
              {m.role === 'bot' && <span className="bot-avatar">🤖</span>}
              <div className="bubble-content">
                <span className="bubble-text">{m.content.replace(/\*\*/g, '').replace(/[\r\n]+/g, ' ')}</span>
              </div>

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
            placeholder={language === 'hindi' ? 'अपना संदेश लिखें...' : 'Type a message...'}
          />
          <button className="send-btn" onClick={handleSend}>➤</button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;

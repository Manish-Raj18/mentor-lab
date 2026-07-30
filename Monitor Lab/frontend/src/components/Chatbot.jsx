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
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const speakBrowser = useCallback((text, lang, done) => {
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = 0.9;
      const v = voices.find(x => x.lang.startsWith(lang.split('-')[0]));
      if (v) u.voice = v;
      u.onend = done; u.onerror = done;
      setTimeout(() => window.speechSynthesis.speak(u), 100);
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; setTimeout(trySpeak, 200); };
    } else {
      trySpeak();
    }
  }, []);

  const playTtsChunks = useCallback(async (text, done) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += 180) {
      let end = Math.min(i + 180, text.length);
      if (end < text.length) { const b = text.lastIndexOf(' ', end); if (b > i) end = b; }
      chunks.push(text.substring(i, end).trim());
    }
    const play = async (idx) => {
      if (idx >= chunks.length) { done(); return; }
      try {
        const r = await axios.post('http://localhost:5000/api/ai/tts', { text: chunks[idx], lang: 'hindi' }, { responseType: 'blob' });
        const a = new Audio(URL.createObjectURL(r.data));
        audioRef.current = a;
        a.onended = () => { URL.revokeObjectURL(a.src); audioRef.current = null; play(idx + 1); };
        a.onerror = () => { URL.revokeObjectURL(a.src); audioRef.current = null; play(idx + 1); };
        a.play().catch(done);
      } catch { done(); }
    };
    play(0);
  }, []);

  const speakText = useCallback((text, index) => {
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim();
    if (!cleanText) return;

    if (speakingIndex === index) { window.speechSynthesis.cancel(); setSpeakingIndex(null); return; }
    window.speechSynthesis.cancel();
    setSpeakingIndex(index);

    if (language === 'english') {
      speakBrowser(cleanText, 'en-US', () => setSpeakingIndex(null));
    } else {
      playTtsChunks(cleanText, () => speakBrowser(cleanText, 'hi-IN', () => setSpeakingIndex(null)));
    }
  }, [speakingIndex, language, speakBrowser, playTtsChunks]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', { message: input, language });
      const cleanReply = response.data.reply
        .replace(/\r\n/g, '\n')
        .split(/\n\s*\n/)
        .map(p => p.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join('\n\n');
      setMessages(prev => [...prev, { role: 'bot', content: cleanReply }]);
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
              <div key={i} className={`message-row ${m.role}`}>
                <div className={`chat-bubble ${m.role}`}>
                  <span className="bubble-text">{m.content.replace(/\*\*/g, '')}</span>
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

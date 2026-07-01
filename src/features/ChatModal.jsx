import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { MockApi } from '../services/MockApi';
import './ChatModal.css';

function ChatModal({ provider, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadChat = async () => {
      const history = await MockApi.getChatHistory(provider.id);
      setMessages(history);
    };
    loadChat();
  }, [provider.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');

    // Simulate provider reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'provider',
        text: 'I will be there on time. Thanks for booking!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  return (
    <div className="chat-overlay animate-fade-in">
      <div className="chat-modal glass">
        <div className="chat-header">
          <div className="flex items-center gap-3">
            <div className="chat-avatar">
              <img src={provider.image} alt={provider.name} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>{provider.name}</h3>
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Online</span>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.sender === 'user' ? 'sent' : 'received'}`}>
              <div className="message-bubble">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-footer" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="send-btn" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;

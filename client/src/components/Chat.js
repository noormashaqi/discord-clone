import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../api';

const socket = io('http://localhost:5000');

export default function Chat({ user, onLogout }) {
  const [channels, setChannels]       = useState([]);
  const [active, setActive]           = useState(null);
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [newChan, setNewChan]         = useState('');
  const [showAdd, setShowAdd]         = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/channels').then(res => {
      setChannels(res.data);
      if (res.data.length) setActive(res.data[0]);
    });
  }, []);


  useEffect(() => {
    if (!active) return;
    socket.emit('join_channel', active._id);
    api.get(`/messages/${active._id}`).then(res => setMessages(res.data));
  }, [active]);


  useEffect(() => {
    socket.on('receive_message', msg => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('receive_message');
  }, []);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !active) return;
    socket.emit('send_message', {
      channelId: active._id,
      content:   input.trim(),
      username:  user.username,
      userId:    user.id
    });
    setInput('');
  };

  const createChannel = async () => {
    if (!newChan.trim()) return;
    try {
      const res = await api.post('/channels', { name: newChan.toLowerCase().replace(/\s+/g, '-') });
      setChannels(prev => [...prev, res.data]);
      setNewChan(''); setShowAdd(false);
      setActive(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating channel');
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">💬</span>
          <span className="sidebar-title">DiscordLite</span>
        </div>

        <div className="channels-section">
          <div className="channels-label">
            <span>CHANNELS</span>
            <button className="add-btn" onClick={() => setShowAdd(!showAdd)}>+</button>
          </div>

          {showAdd && (
            <div className="add-channel-form">
              <input placeholder="channel-name" value={newChan}
                onChange={e => setNewChan(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createChannel()} />
              <button onClick={createChannel}>Add</button>
            </div>
          )}

          <ul className="channel-list">
            {channels.map(ch => (
              <li key={ch._id}
                className={`channel-item ${active?._id === ch._id ? 'active' : ''}`}
                onClick={() => setActive(ch)}>
                <span className="hash">#</span> {ch.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="user-panel">
          <div className="user-avatar">{user.username[0].toUpperCase()}</div>
          <div className="user-info">
            <span className="user-name">{user.username}</span>
            <span className="user-status">● Online</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">⏻</button>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="chat-main">
        <div className="chat-header">
          <span className="chat-header-hash">#</span>
          <span className="chat-header-name">{active?.name || 'Select a channel'}</span>
          {active?.description && <span className="chat-header-desc">— {active.description}</span>}
        </div>

        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">👋</div>
              <p>This is the beginning of <strong>#{active?.name}</strong></p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg._id} className={`message ${msg.senderName === user.username ? 'own' : ''}`}>
              <div className="msg-avatar">{msg.senderName?.[0]?.toUpperCase()}</div>
              <div className="msg-body">
                <div className="msg-header">
                  <span className="msg-author">{msg.senderName}</span>
                  <span className="msg-time">{formatTime(msg.createdAt)}</span>
                </div>
                <div className="msg-content">{msg.content}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <input className="msg-input"
            placeholder={`Message #${active?.name || '...'}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={!active} />
          <button className="send-btn" onClick={sendMessage} disabled={!active || !input.trim()}>
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}
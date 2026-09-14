'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface ConversationItem {
  conversationId: string;
  matchId: string;
  partner: {
    id: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    profile?: {
      photos: { fileUrl: string }[];
    };
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
  isCallUnlocked: boolean;
}

interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const { user, token } = useAuth();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConv, setActiveConv] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  // WebRTC Call state
  const [activeCall, setActiveCall] = useState<{
    callType: 'AUDIO' | 'VIDEO';
    partnerName: string;
    partnerPhoto: string;
    status: 'RINGING' | 'CONNECTED';
    duration: number;
  } | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.data || []);
        if (data.data && data.data.length > 0 && !activeConv) {
          setActiveConv(data.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [token]);

  // Fetch messages when active conversation changes
  const fetchMessages = async (convId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/chat/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
        // Mark as read
        fetch(`/api/v1/chat/conversations/${convId}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.conversationId);
    }
  }, [activeConv, token]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv || !token) return;

    const text = inputText.trim();
    setInputText('');

    // Optimistic UI
    const tempMsg: MessageItem = {
      id: `temp-${Date.now()}`,
      conversationId: activeConv.conversationId,
      senderId: user?.id || '',
      content: text,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/v1/chat/conversations/${activeConv.conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.success) {
        // Replace temp message with persisted message
        setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? data.data : m)));
      }
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  };

  // Start Call
  const handleStartCall = (callType: 'AUDIO' | 'VIDEO') => {
    if (!activeConv) return;
    const partnerPhoto =
      activeConv.partner.profile?.photos?.[0]?.fileUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';

    setActiveCall({
      callType,
      partnerName: `${activeConv.partner.firstName} ${activeConv.partner.lastName}`,
      partnerPhoto,
      status: 'RINGING',
      duration: 0,
    });

    // Simulate connection after 2 seconds
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'CONNECTED' } : null));
      callTimerRef.current = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }, 2000);
  };

  // End Call
  const handleEndCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setActiveCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ height: 'calc(100vh - 80px)', background: 'var(--bg-primary)', display: 'flex', overflow: 'hidden' }}>
      
      {/* Left Sidebar: Conversations list */}
      <div
        style={{
          width: '340px',
          borderRight: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            Messages & Calls
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
            Encrypted 1-on-1 Matrimonial Conversations
          </p>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && (
            <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading chats...</p>
          )}

          {!loading && conversations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>💬</span>
              <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>No active conversations yet.</p>
              <Link href="/matches" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                Find Matches
              </Link>
            </div>
          )}

          {conversations.map((conv) => {
            const isSelected = activeConv?.conversationId === conv.conversationId;
            const photo =
              conv.partner.profile?.photos?.[0]?.fileUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

            return (
              <div
                key={conv.conversationId}
                onClick={() => setActiveConv(conv)}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  background: isSelected ? 'rgba(212,175,55,0.1)' : 'transparent',
                  borderLeft: isSelected ? '4px solid var(--gold)' : '4px solid transparent',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                  <img src={photo} alt={conv.partner.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: isSelected ? 'var(--gold)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.partner.firstName} {conv.partner.lastName}
                    </h4>
                    {conv.unreadCount > 0 && (
                      <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.lastMessage?.content || 'Match created! Say hello 👋'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Main Pane: Chat Screen */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#09090b' }}>
        {activeConv ? (
          <>
            {/* Chat Top Header */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--gold)' }}>
                  <img
                    src={
                      activeConv.partner.profile?.photos?.[0]?.fileUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
                    }
                    alt="Partner"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {activeConv.partner.firstName} {activeConv.partner.lastName}
                    {activeConv.partner.isVerified && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✓ Shield</span>
                    )}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online (End-to-End Encrypted)</span>
                </div>
              </div>

              {/* Call Controls */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleStartCall('AUDIO')}
                  className="btn btn-secondary"
                  title="Start Audio Call"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  📞 Audio Call
                </button>
                <button
                  onClick={() => handleStartCall('VIDEO')}
                  className="btn btn-primary"
                  title="Start HD Video Call"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  📹 Video Call
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🔒 Messages are protected by Mangal Trust & Privacy standards
                </span>
              </div>

              {messages.map((m) => {
                const isMine = m.senderId === user?.id;

                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '65%',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        borderBottomRightRadius: isMine ? '2px' : '14px',
                        borderBottomLeftRadius: isMine ? '14px' : '2px',
                        background: isMine
                          ? 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(139,0,0,0.3) 100%)'
                          : 'var(--bg-secondary)',
                        border: isMine ? '1px solid rgba(212,175,55,0.4)' : '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '0.92rem',
                        lineHeight: 1.4,
                      }}
                    >
                      <div>{m.content}</div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                          textAlign: 'right',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMine && <span style={{ color: 'var(--gold)' }}>✓✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '24px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn btn-primary"
                style={{ borderRadius: '24px', padding: '10px 22px' }}
              >
                Send ➔
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a conversation to begin chatting
          </div>
        )}
      </div>

      {/* WebRTC Video / Audio Call Overlay Modal */}
      {activeCall && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 5, 8, 0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
              🔒 {activeCall.callType === 'VIDEO' ? 'Encrypted HD Video Call' : 'Encrypted Audio Call'}
            </span>
            <h2 style={{ fontSize: '2rem', color: '#fff', margin: '4px 0' }}>{activeCall.partnerName}</h2>
            <p style={{ color: activeCall.status === 'CONNECTED' ? '#10b981' : 'var(--gold)', fontSize: '1rem', margin: 0 }}>
              {activeCall.status === 'CONNECTED' ? `Call Active • ${formatDuration(activeCall.duration)}` : 'Ringing...'}
            </p>
          </div>

          {/* Video stream container */}
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              height: '380px',
              background: '#121217',
              borderRadius: '20px',
              border: '2px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
            }}
          >
            {activeCall.callType === 'VIDEO' && !isVideoOff ? (
              <img
                src={activeCall.partnerPhoto}
                alt={activeCall.partnerName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px auto', border: '3px solid var(--gold)' }}>
                  <img src={activeCall.partnerPhoto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Audio Only Mode</p>
              </div>
            )}

            {/* Picture in picture self view */}
            {activeCall.callType === 'VIDEO' && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '120px',
                  height: '80px',
                  borderRadius: '10px',
                  background: '#222',
                  border: '1px solid var(--gold)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                }}
              >
                You
              </div>
            )}
          </div>

          {/* Call action buttons */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '36px' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>

            {activeCall.callType === 'VIDEO' && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: isVideoOff ? '#ef4444' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
                title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isVideoOff ? '🚫' : '📹'}
              </button>
            )}

            <button
              onClick={handleEndCall}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ef4444',
                border: 'none',
                color: '#fff',
                fontSize: '1.4rem',
                cursor: 'pointer',
              }}
              title="End Call"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

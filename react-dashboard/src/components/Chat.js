import { useEffect, useState, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { chatApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [receiverInput, setReceiverInput] = useState('');
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const { token, email } = useAuth();


    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load conversations (sidebar)
    const loadConversations = useCallback(async () => {
        try {
            const res = await chatApi.get('/chat/conversations');
            setConversations(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // Load history for selected user
    const loadHistory = useCallback(async (id) => {
        if (!id) return;
        try {
            const res = await chatApi.get(`/chat/history/${id}`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    // Auto-load history when receiverId changes
    useEffect(() => {
        if (receiverId) loadHistory(receiverId);
    }, [receiverId, loadHistory]);

    // Load conversations on mount + poll every 5s
    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, 5000);
        return () => clearInterval(interval);
    }, [loadConversations]);

    // WebSocket
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe('/user/queue/messages', (message) => {
                    const msg = JSON.parse(message.body);
                    setMessages((prev) => [...prev, msg]);
                    loadConversations(); // refresh sidebar on new message
                });
            },
        });
        client.activate();
        clientRef.current = client;
        return () => client.deactivate();
    }, [token, loadConversations]);

    const sendMessage = async () => {
        if (!newMessage || !receiverId) return;
        try {
            const res = await chatApi.post('/chat/send', {
                receiverId,
                content: newMessage,
            });
            setMessages((prev) => [...prev, res.data]);
            setNewMessage('');
            loadConversations();
        } catch (err) {
            console.error(err);
        }
    };

    const selectConversation = (otherId) => {
        setReceiverId(otherId);
        setReceiverInput(otherId);
    };

    // Get the other person in a conversation
    const getOtherId = (msg) =>
        msg.senderId === email ? msg.receiverId : msg.senderId;

    // Deduplicate conversations by other person
    const uniqueConversations = conversations.reduce((acc, msg) => {
        const otherId = getOtherId(msg);
        if (!acc.find((m) => getOtherId(m) === otherId)) acc.push(msg);
        return acc;
    }, []);

    const s = {
        root: {
            display: 'flex',
            height: '100vh',
            fontFamily: "'Inter', sans-serif",
            background: '#f7f7f8',
            overflow: 'hidden',
        },

        // --- Sidebar ---
        sidebar: {
            width: '260px',
            minWidth: '260px',
            background: '#ffffff',
            borderRight: '1px solid #e5e5e5',
            display: 'flex',
            flexDirection: 'column',
        },
        sidebarHeader: {
            padding: '1.2rem 1rem',
            borderBottom: '1px solid #e5e5e5',
            fontSize: '15px',
            fontWeight: '600',
            color: '#111',
        },
        newChatBar: {
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            gap: '6px',
        },
        newChatInput: {
            flex: 1,
            padding: '0.45rem 0.7rem',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '13px',
            outline: 'none',
            background: '#f9f9f9',
            color: '#111',
        },
        newChatBtn: {
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            background: '#111',
            color: '#fff',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500',
        },
        convList: {
            flex: 1,
            overflowY: 'auto',
        },
        convItem: (active) => ({
            padding: '0.85rem 1rem',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            background: active ? '#f3f3f3' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'background 0.15s',
        }),
        avatar: {
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#111',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: '600',
            flexShrink: 0,
        },
        convName: {
            fontSize: '13px',
            fontWeight: '500',
            color: '#111',
            marginBottom: '2px',
        },
        convPreview: {
            fontSize: '12px',
            color: '#999',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '160px',
        },

        // --- Main chat ---
        main: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        },
        chatHeader: {
            padding: '1rem 1.5rem',
            background: '#ffffff',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        chatHeaderDot: {
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: receiverId ? '#22c55e' : '#d1d5db',
            flexShrink: 0,
        },
        chatHeaderName: {
            fontSize: '15px',
            fontWeight: '600',
            color: '#111',
            margin: 0,
        },
        messagesArea: {
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        },
        emptyState: {
            textAlign: 'center',
            color: '#bbb',
            fontSize: '13px',
            marginTop: '3rem',
        },
        msgRow: (isMine) => ({
            display: 'flex',
            justifyContent: isMine ? 'flex-end' : 'flex-start',
        }),
        msgBubble: (isMine) => ({
            maxWidth: '65%',
            padding: '0.55rem 0.95rem',
            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: isMine ? '#111' : '#ffffff',
            color: isMine ? '#fff' : '#111',
            fontSize: '14px',
            lineHeight: '1.5',
            border: isMine ? 'none' : '1px solid #e5e5e5',
        }),
        senderLabel: (isMine) => ({
            fontSize: '11px',
            color: '#bbb',
            marginTop: '2px',
            textAlign: isMine ? 'right' : 'left',
            paddingLeft: isMine ? 0 : '4px',
            paddingRight: isMine ? '4px' : 0,
        }),
        inputBar: {
            padding: '1rem 1.5rem',
            background: '#ffffff',
            borderTop: '1px solid #e5e5e5',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
        },
        messageInput: {
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: '999px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            outline: 'none',
            background: '#f9f9f9',
            color: '#111',
        },
        sendBtn: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#111',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        },
    };

    const initials = (id) =>
        id ? id.substring(0, 2).toUpperCase() : '??';

    return (
        <div style={s.root}>
            {/* Sidebar */}
            <div style={s.sidebar}>
                <div style={s.sidebarHeader}>💬 Messages</div>

                {/* New chat input */}
                <div style={s.newChatBar}>
                    <input
                        placeholder="New chat (email)..."
                        value={receiverInput}
                        onChange={(e) => setReceiverInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && receiverInput) {
                                selectConversation(receiverInput);
                            }
                        }}
                        style={s.newChatInput}
                    />
                    <button
                        onClick={() => receiverInput && selectConversation(receiverInput)}
                        style={s.newChatBtn}
                    >
                        +
                    </button>
                </div>

                {/* Conversations list */}
                <div style={s.convList}>
                    {uniqueConversations.length === 0 && (
                        <div style={{ padding: '1rem', fontSize: '12px', color: '#bbb', textAlign: 'center' }}>
                            No conversations yet
                        </div>
                    )}
                    {uniqueConversations.map((msg, i) => {
                        const otherId = getOtherId(msg);
                        const isActive = otherId === receiverId;
                        return (
                            <div
                                key={i}
                                style={s.convItem(isActive)}
                                onClick={() => selectConversation(otherId)}
                            >
                                <div style={s.avatar}>{initials(otherId)}</div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={s.convName}>{otherId}</div>
                                    <div style={s.convPreview}>{msg.content}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main chat area */}
            <div style={s.main}>
                {/* Chat header */}
                <div style={s.chatHeader}>
                    <div style={s.chatHeaderDot} />
                    <h3 style={s.chatHeaderName}>
                        {receiverId || 'Select a conversation'}
                    </h3>
                </div>

                {/* Messages */}
                <div style={s.messagesArea}>
                    {!receiverId && (
                        <div style={s.emptyState}>
                            Select a conversation or start a new one
                        </div>
                    )}
                    {receiverId && messages.length === 0 && (
                        <div style={s.emptyState}>No messages yet. Say hi! 👋</div>
                    )}
                    {messages.map((msg, i) => {
                        const isMine = msg.senderId === email;
                        return (
                            <div key={i}>
                                <div style={s.msgRow(isMine)}>
                                    <div style={s.msgBubble(isMine)}>
                                        {msg.content}
                                    </div>
                                </div>
                                <div style={s.senderLabel(isMine)}>
                                    {msg.senderId}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {receiverId && (
                    <div style={s.inputBar}>
                        <input
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            style={s.messageInput}
                        />
                        <button onClick={sendMessage} style={s.sendBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
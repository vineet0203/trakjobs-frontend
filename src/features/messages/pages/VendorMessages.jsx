import React, { useEffect, useState, useRef } from 'react';
import { getConversations, getMessages, sendMessage, markAsRead } from '../services/messagesService';
import ChatWindow from '../components/ChatWindow';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { API_BASE_URL } from '../../../utils/constants';
import './VendorMessages.css';

const VendorMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const vendorId = user?.vendor_id;
  const token = localStorage.getItem('access_token');
  const echoInstanceRef = useRef(null);

  // Load conversations list
  const loadConversations = async (searchVal = '') => {
    setLoadingConversations(true);
    try {
      const data = await getConversations(searchVal);
      setConversations(data.data || []);
    } catch (e) {
      console.error('Error fetching conversations:', e);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Set up search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadConversations(searchText);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  // Load chat history when customer is selected
  const handleSelectCustomer = async (customerId) => {
    setActiveCustomerId(customerId);
    setLoadingMessages(true);
    try {
      const data = await getMessages(customerId);
      setMessages(data.data || []);
      
      // Mark as read immediately
      await markAsRead(customerId);
      
      // Update local conversation list's unread count to 0
      setConversations(prev =>
        prev.map(c => c.id === customerId ? { ...c, unread_count: 0 } : c)
      );
      
      // Dispatch custom event to notify sidebar/badge to refresh
      window.dispatchEvent(new CustomEvent('messages-updated'));
    } catch (e) {
      console.error('Error fetching messages:', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Setup Echo subscription for real-time messages
  useEffect(() => {
    if (!vendorId || !activeCustomerId || !token) return;

    // Initialize Echo if not already done
    if (!echoInstanceRef.current) {
      window.Pusher = Pusher;
      echoInstanceRef.current = new Echo({
        broadcaster: 'pusher',
        key: 'trakjobs_key',
        wsHost: '45.63.106.38',
        wsPort: 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${API_BASE_URL}/chat/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
    }

    const channelName = `chat.vendor.${vendorId}.customer.${activeCustomerId}`;
    const channel = echoInstanceRef.current.private(channelName);

    channel.listen('.message.sent', (data) => {
      // Append the message to state if it matches the current conversation
      if (data.customer_id === activeCustomerId && data.vendor_id === vendorId) {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, data];
        });

        // Mark it as read immediately since the conversation is active
        if (data.sender_type === 'customer') {
          markAsRead(activeCustomerId).catch(console.error);
        }
      }
    });

    return () => {
      if (echoInstanceRef.current) {
        echoInstanceRef.current.leave(channelName);
      }
    };
  }, [activeCustomerId, vendorId, token]);

  const handleSend = async (body) => {
    if (!activeCustomerId) return;
    try {
      const response = await sendMessage(activeCustomerId, body);
      const newMsg = response.data;
      
      // Append sent message
      setMessages(prev => [...prev, newMsg]);

      // Update conversations sidebar last message
      setConversations(prev => {
        return prev.map(c => {
          if (c.id === activeCustomerId) {
            return {
              ...c,
              last_message: {
                body: newMsg.body,
                sender_type: newMsg.sender_type,
                created_at: newMsg.created_at
              }
            };
          }
          return c;
        });
      });
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  const activeCustomer = conversations.find(c => c.id === activeCustomerId);

  return (
    <div className="vendor-messages-page">
      {/* Left Sidebar */}
      <div className="messages-sidebar">
        <div className="search-box-wrap">
          <input
            type="text"
            className="customer-search-input"
            placeholder="Search customers..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {loadingConversations ? (
            <div className="conversations-loading">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="conversations-empty">No conversations found</div>
          ) : (
            conversations.map((c) => {
              const isActive = c.id === activeCustomerId;
              return (
                <div
                  key={c.id}
                  className={`conversation-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectCustomer(c.id)}
                >
                  <div className="conversation-avatar">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <span className="customer-name">{c.name}</span>
                      {c.unread_count > 0 && (
                        <span className="unread-badge">{c.unread_count}</span>
                      )}
                    </div>
                    {c.last_message && (
                      <p className="last-message-text">
                        {c.last_message.sender_type === 'vendor' ? 'You: ' : ''}
                        {c.last_message.body}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="chat-panel">
        {activeCustomerId ? (
          loadingMessages ? (
            <div className="chat-loading">Loading message history...</div>
          ) : (
            <ChatWindow
              messages={messages}
              onSendMessage={handleSend}
              recipientName={activeCustomer?.name}
              currentUserType="vendor"
            />
          )
        ) : (
          <div className="chat-no-selection">
            <h3>Select a customer to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorMessages;

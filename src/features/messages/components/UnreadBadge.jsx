import React, { useEffect, useState } from 'react';
import { getUnreadCount } from '../services/messagesService';

const UnreadBadge = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const data = await getUnreadCount();
      setCount(data.data?.count || 0);
    } catch (e) {
      console.error('Error fetching unread count:', e);
    }
  };

  useEffect(() => {
    fetchCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);

    // Also listen to a custom event from the chat window when messages are sent/received
    const handleUpdate = () => {
      fetchCount();
    };

    window.addEventListener('messages-updated', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('messages-updated', handleUpdate);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span style={{
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '10px',
      fontWeight: 'bold',
      marginLeft: '8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '12px',
      height: '14px'
    }}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default UnreadBadge;

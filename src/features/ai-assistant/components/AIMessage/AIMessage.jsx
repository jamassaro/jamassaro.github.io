/**
 * AIMessage Component
 * Following SRP: Renders individual chat message
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './AIMessage.module.css';

const AIMessage = ({ role, content, timestamp }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`${styles.message} ${styles[role]}`}>
      <div className={styles.header}>
        <span className={styles.role}>
          {role === 'user' ? 'USER' : 'ASSISTANT'}
        </span>
        <span className={styles.timestamp}>{formatTime(timestamp)}</span>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

AIMessage.propTypes = {
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
};

export default AIMessage;

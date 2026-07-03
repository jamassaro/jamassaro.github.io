/**
 * AIMessage Component
 * Following SRP: Renders individual chat message
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './AIMessage.module.css';

const AIMessage = ({ role, content, timestamp, isTyping, onSkipTyping }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClick = () => {
    if (isTyping && onSkipTyping) {
      onSkipTyping();
    }
  };

  return (
    <div 
      className={`${styles.message} ${styles[role]} ${isTyping ? styles.typing : ''}`}
      onClick={handleClick}
      style={isTyping ? { cursor: 'pointer' } : {}}
      title={isTyping ? 'Click to skip animation' : ''}
    >
      <div className={styles.header}>
        <span className={styles.role}>
          {role === 'user' ? 'USER' : 'ASSISTANT'}
          {isTyping && <span className={styles.typingIndicator}> ⌨️ typing...</span>}
        </span>
        <span className={styles.timestamp}>{formatTime(timestamp)}</span>
      </div>
      <div className={styles.content}>{content}</div>
      {isTyping && (
        <div className={styles.skipHint}>Click to skip animation</div>
      )}
    </div>
  );
};

AIMessage.propTypes = {
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  isTyping: PropTypes.bool,
  onSkipTyping: PropTypes.func,
};

AIMessage.defaultProps = {
  isTyping: false,
  onSkipTyping: null,
};

export default AIMessage;

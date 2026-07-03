/**
 * AIMessage Component
 * Following SRP: Renders individual chat message
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './AIMessage.module.css';

const AIMessage = ({ role, content, timestamp, isTyping, onSkipTyping, followUps = [], onFollowUpClick }) => {
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

  const handleFollowUpClick = (followUp) => {
    if (onFollowUpClick && !isTyping) {
      onFollowUpClick(followUp);
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
      {!isTyping && followUps.length > 0 && (
        <div className={styles.followUps}>
          <div className={styles.followUpLabel}>💡 Learn more:</div>
          <div className={styles.followUpButtons}>
            {followUps.map((followUp, index) => (
              <button
                key={index}
                className={styles.followUpButton}
                onClick={() => handleFollowUpClick(followUp)}
                type="button"
              >
                {followUp}
              </button>
            ))}
          </div>
        </div>
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
  followUps: PropTypes.arrayOf(PropTypes.string),
  onFollowUpClick: PropTypes.func,
};

AIMessage.defaultProps = {
  isTyping: false,
  onSkipTyping: null,
  followUps: [],
  onFollowUpClick: null,
};

export default AIMessage;

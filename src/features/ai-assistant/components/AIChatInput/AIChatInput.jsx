/**
 * AIChatInput Component
 * Following SRP: Handles chat input and action buttons
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './AIChatInput.module.css';

const AIChatInput = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
  onEnableAI,
  onViewArchitecture,
}) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.container}>
      {/* Input Area */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={disabled || !inputValue.trim()}
            aria-label="Send message"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={onEnableAI}
          disabled={disabled}
        >
          <span className={styles.buttonIcon}>⚡</span>
          Enable Local AI
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.secondary}`}
          onClick={onViewArchitecture}
        >
          <span className={styles.buttonIcon}>📐</span>
          View Architecture
        </button>
      </div>
    </div>
  );
};

AIChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  onEnableAI: PropTypes.func.isRequired,
  onViewArchitecture: PropTypes.func.isRequired,
};

export default AIChatInput;

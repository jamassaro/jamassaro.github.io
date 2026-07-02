/**
 * AIChatWindow Component
 * Following SRP: Manages chat interface layout and message display
 */

import React from 'react';
import PropTypes from 'prop-types';
import AIMessage from '../AIMessage';
import QuickPromptList from '../QuickPromptList';
import AIChatInput from '../AIChatInput';
import { useScroll } from '../../hooks';
import styles from './AIChatWindow.module.css';

const AIChatWindow = ({
  messages,
  onSendMessage,
  onPromptClick,
  onEnableAI,
  onViewArchitecture,
  isLoading = false,
  quickPrompts,
}) => {
  const { scrollRef } = useScroll([messages]);

  return (
    <div className={styles.window}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.terminalDots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            Runs in browser
          </span>
        </div>
        <h2 className={styles.title}>ASK_MY_PORTFOLIO / LOCAL_AI_DEMO</h2>
      </div>

      {/* Messages Container */}
      <div ref={scrollRef} className={styles.messagesContainer}>
        <div className={styles.messages}>
          {messages.map((message) => (
            <AIMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className={styles.loadingIndicator}>
              <span className={styles.loadingDot}></span>
              <span className={styles.loadingDot}></span>
              <span className={styles.loadingDot}></span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Prompts */}
      <div className={styles.quickPrompts}>
        <QuickPromptList
          prompts={quickPrompts}
          onPromptClick={onPromptClick}
          disabled={isLoading}
        />
      </div>

      {/* Input Area */}
      <AIChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        placeholder="Ask about my AI projects, GCP experience, architecture, or leadership..."
        onEnableAI={onEnableAI}
        onViewArchitecture={onViewArchitecture}
      />
    </div>
  );
};

AIChatWindow.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onPromptClick: PropTypes.func.isRequired,
  onEnableAI: PropTypes.func.isRequired,
  onViewArchitecture: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  quickPrompts: PropTypes.array.isRequired,
};

export default AIChatWindow;

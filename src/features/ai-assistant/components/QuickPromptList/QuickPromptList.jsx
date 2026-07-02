/**
 * QuickPromptList Component
 * Following SRP: Renders scrollable list of quick prompt buttons
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './QuickPromptList.module.css';

const QuickPromptList = ({ prompts, onPromptClick, disabled = false }) => {
  const handleClick = (prompt) => {
    console.log('🎯 Quick prompt clicked:', prompt.label);
    onPromptClick(prompt.prompt);
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            className={styles.promptButton}
            onClick={() => handleClick(prompt)}
            disabled={disabled}
            type="button"
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

QuickPromptList.propTypes = {
  prompts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      prompt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPromptClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default QuickPromptList;

/**
 * AIAssistantSection Component
 * Following SRP: Main section orchestrating chat and architecture panels
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatWindow from '../AIChatWindow';
import ArchitecturePanel from '../ArchitecturePanel';
import { useChat } from '../../hooks';
import {
  quickPrompts,
  pipelineSteps,
  techBadges,
  featureBadges,
  architectureContent,
} from '../../data';
import styles from './AIAssistantSection.module.css';

const AIAssistantSection = () => {
  const [t] = useTranslation();
  const { messages, sendMessage, isLoading } = useChat();
  
  // Initialize showArchitecture based on screen size
  // Desktop (>900px): Show by default
  // Mobile/Tablet (<=900px): Hide by default (user can toggle)
  const [showArchitecture, setShowArchitecture] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 900;
    }
    return true; // SSR fallback
  });

  // Handle window resize to adapt architecture panel visibility
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth > 900;
      // On desktop, always show; on mobile, keep user's toggle state
      if (isDesktop && !showArchitecture) {
        setShowArchitecture(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showArchitecture]);

  const handleEnableAI = () => {
    console.log('⚡ Enable Local AI clicked');
    console.log('(UI-only demo - actual implementation would initialize WebLLM)');
  };

  const handleViewArchitecture = () => {
    console.log('📐 View Architecture clicked');
    setShowArchitecture(!showArchitecture);
  };

  return (
    <section className={styles.section} id="ai-assistant">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.tag}>EXPERIMENTAL</span>
          <h2 className={styles.title}>
            {t('ai-assistant.title', 'ASK_MY_PORTFOLIO / LOCAL_AI_DEMO')}
          </h2>
          <p className={styles.description}>
            {t(
              'ai-assistant.description',
              'Interactive AI assistant powered by local LLMs. Ask questions about my experience, projects, and technical expertise - all running privately in your browser.'
            )}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className={styles.grid}>
          {/* Left: Chat Window */}
          <div className={styles.chatColumn}>
            <AIChatWindow
              messages={messages}
              onSendMessage={sendMessage}
              onPromptClick={sendMessage}
              onEnableAI={handleEnableAI}
              onViewArchitecture={handleViewArchitecture}
              isLoading={isLoading}
              quickPrompts={quickPrompts}
            />
          </div>

          {/* Right: Architecture Panel */}
          <div
            className={`${styles.architectureColumn} ${
              showArchitecture ? styles.visible : styles.hidden
            }`}
          >
            <ArchitecturePanel
              title={architectureContent.title}
              subtitle={architectureContent.subtitle}
              steps={pipelineSteps}
              techBadges={techBadges}
              featureBadges={featureBadges}
              howItWorksTitle={architectureContent.howItWorksTitle}
              howItWorksContent={architectureContent.howItWorksContent}
              disclaimer={architectureContent.disclaimer}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;

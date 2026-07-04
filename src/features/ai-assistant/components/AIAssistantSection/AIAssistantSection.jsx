/**
 * AIAssistantSection Component
 * Following SRP: Main section orchestrating chat and architecture panels
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatWindow from '../AIChatWindow';
import ArchitecturePanel from '../ArchitecturePanel';
import MobileWarning from '../MobileWarning';
import { useConversation } from '../../conversation';
import { DEFAULT_MODEL, isWebGPUSupported } from '../../conversation/config/modelConfig.js';
import { isMobileDevice } from '../../../../utils/deviceDetection.js';
import {
  quickPrompts,
  pipelineSteps,
  techBadges,
  featureBadges,
  architectureContent,
} from '../../data';
import styles from './AIAssistantSection.module.css';

const AIAssistantSection = () => {
  const [t, { language }] = useTranslation();
  
  // Normalize language code (en-US -> en, es-ES -> es)
  const normalizedLanguage = language?.split('-')[0] || 'en';
  
  // Detect if user is on mobile/tablet device
  // Mobile devices cannot handle 2.2GB model download (causes crashes/refresh)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return isMobileDevice();
    }
    return false; // SSR fallback
  });
  
  // State for tracking model download progress
  const [downloadProgress, setDownloadProgress] = useState(null);
  
  // Initialize conversation system with WebLLM provider (on-demand)
  const { 
    messages, 
    sendMessage, 
    isLoading,
    isTyping,
    isReady,
    isInitializing,
    error,
    clearError,
    initialize,
    skipTyping,
    followUps,
    sendFollowUp,
  } = useConversation({
    providerType: 'webllm', // Using WebLLM - real LLM in browser
    language: normalizedLanguage,
    persistHistory: true,
    autoInitialize: false, // User must click "Enable AI" to start download
    providerConfig: {
      model: DEFAULT_MODEL.id, // Phi-3.5-mini-instruct-q4f16_1-MLC (2.2GB)
      temperature: 0.7,
      maxTokens: 400, // Enough for answer + follow-ups
      onProgress: (progress) => {
        setDownloadProgress(progress);
      }
    }
  });
  
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
      
      // Update mobile detection on resize (e.g., orientation change)
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showArchitecture]);

  const handleEnableAI = () => {
    if (!isReady && !isInitializing) {
      // Check WebGPU support before starting
      if (!isWebGPUSupported()) {
        alert(
          'WebGPU Not Supported\n\n' +
          'Your browser does not support WebGPU, which is required for local AI.\n\n' +
          'Supported browsers:\n' +
          '• Chrome/Edge 113+\n' +
          '• Safari 18+\n\n' +
          'The AI assistant will continue using simpler responses.'
        );
        return;
      }

      // Show confirmation dialog with model info
      const confirmed = confirm(
        `Enable Local AI Assistant\n\n` +
        `Model: ${DEFAULT_MODEL.name}\n` +
        `Size: ${DEFAULT_MODEL.size}\n` +
        `Download Time: ${DEFAULT_MODEL.downloadTime}\n` +
        `Quality: ${DEFAULT_MODEL.quality}\n\n` +
        `This will download the AI model to your browser.\n` +
        `The model will be cached for instant loading on future visits.\n\n` +
        `Continue?`
      );

      if (confirmed) {
        initialize();
      }
    }
  };

  const handleViewArchitecture = () => {
    setShowArchitecture(!showArchitecture);
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      // Show error to user
      alert(`AI Error: ${error.message}\n\nPlease try again.`);
      
      // Auto-clear after showing
      setTimeout(clearError, 1000);
    }
  }, [error, clearError]);

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
          {/* Left: Chat Window or Mobile Warning */}
          <div className={styles.chatColumn}>
            {isMobile ? (
              <MobileWarning onViewArchitecture={handleViewArchitecture} />
            ) : (
              <AIChatWindow
                messages={messages}
                onSendMessage={sendMessage}
                onPromptClick={sendMessage}
                onEnableAI={handleEnableAI}
                onViewArchitecture={handleViewArchitecture}
                onSkipTyping={skipTyping}
                isLoading={isLoading}
                isTyping={isTyping}
                isReady={isReady}
                isInitializing={isInitializing}
                downloadProgress={downloadProgress}
                quickPrompts={quickPrompts}
                followUps={followUps}
                onFollowUpClick={sendFollowUp}
              />
            )}
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
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;

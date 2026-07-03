/**
 * AIAssistantSection Component
 * Following SRP: Main section orchestrating chat and architecture panels
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AIChatWindow from '../AIChatWindow';
import ArchitecturePanel from '../ArchitecturePanel';
import { useConversation } from '../../conversation';
import { DEFAULT_MODEL, isWebGPUSupported } from '../../conversation/config/modelConfig.js';
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
  } = useConversation({
    providerType: 'webllm', // Using WebLLM with Llama-3.2-1B (0.9GB)
    language: normalizedLanguage,
    persistHistory: true,
    autoInitialize: false, // User must click "Enable AI" to start download
    providerConfig: {
      model: DEFAULT_MODEL.id, // Llama-3.2-1B-Instruct-q4f16_1-MLC
      temperature: 0.7,
      maxTokens: 500,
      onProgress: (progress) => {
        const progressText = progress.text || `${Math.round((progress.progress || 0) * 100)}%`;
        console.log(`📥 Downloading ${DEFAULT_MODEL.name}: ${progressText}`);
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
        console.log('🚀 Starting Local AI Download');
        console.log(`📦 Model: ${DEFAULT_MODEL.name}`);
        console.log(`💾 Size: ${DEFAULT_MODEL.size}`);
        console.log(`⏱️  Estimated time: ${DEFAULT_MODEL.downloadTime}`);
        console.log('💡 Model will be cached for future visits');
        initialize();
      }
    } else {
      // Show status
      console.log('⚡ Local AI Status');
      console.log('='.repeat(60));
      console.log(`🤖 Model: ${DEFAULT_MODEL.name}`);
      console.log('🔍 Semantic Search: Enabled (Transformers.js)');
      console.log('⚡ AI Actions: Enabled (5 action types)');
      console.log('📚 Knowledge Base: Portfolio content indexed');
      
      if (isInitializing || !isReady) {
        console.log('⏳ Status: Downloading...');
        if (downloadProgress) {
          const progressText = downloadProgress.text || `${Math.round((downloadProgress.progress || 0) * 100)}%`;
          console.log(`📥 Progress: ${progressText}`);
        }
      } else {
        console.log('✅ Status: Ready!');
        console.log('💬 You can now chat with the AI assistant');
      }
      
      console.log('='.repeat(60));
    }
  };

  const handleViewArchitecture = () => {
    console.log('📐 View Architecture clicked');
    setShowArchitecture(!showArchitecture);
  };

  // Log when conversation system is ready
  useEffect(() => {
    if (isReady) {
      console.log('✅ Conversation system initialized');
      console.log('📊 Features active:');
      console.log('  - Knowledge Base (semantic search)');
      console.log('  - AI Actions (portfolio control)');
      console.log('  - Conversation History');
      console.log('  - Multi-language Support');
    }
  }, [isReady]);

  // Expose cache checker to window for debugging
  useEffect(() => {
    window.checkWebLLMCache = async () => {
      try {
        const cacheNames = await caches.keys();
        const webllmCaches = cacheNames.filter(name => name.startsWith('webllm'));
        
        console.log('🔍 WebLLM Cache Status');
        console.log('='.repeat(60));
        
        if (webllmCaches.length === 0) {
          console.log('❌ No WebLLM cache found');
          console.log('💡 Model needs to be downloaded');
          return { cached: false, total: 0 };
        }
        
        let totalEntries = 0;
        for (const cacheName of webllmCaches) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          console.log(`📦 ${cacheName}: ${keys.length} files`);
          totalEntries += keys.length;
        }
        
        console.log('='.repeat(60));
        console.log(`✅ Total cached files: ${totalEntries}`);
        console.log('💾 Cache will persist between page reloads');
        console.log('⚠️  Cache may be cleared by:');
        console.log('   - Private/Incognito browsing');
        console.log('   - "Clear browsing data" (Site data)');
        console.log('   - Storage quota exceeded');
        console.log('   - DevTools > Application > Clear site data');
        
        return { cached: true, total: totalEntries, caches: webllmCaches };
      } catch (err) {
        console.error('❌ Error checking cache:', err);
        return { error: err.message };
      }
    };
    
    console.log('💡 Run window.checkWebLLMCache() to check model cache status');
  }, []);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('❌ Conversation error:', error);
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      console.error('   Can retry:', error.canRetry);
      
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
          {/* Left: Chat Window */}
          <div className={styles.chatColumn}>
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

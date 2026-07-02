/**
 * Integration Example - How to add AI Assistant to your portfolio
 * 
 * This file shows different ways to integrate the AIAssistantSection
 * into your existing portfolio application.
 */

// ============================================
// OPTION 1: Add to Home Page (Recommended)
// ============================================

// File: src/pages/Home/Home.jsx
import React from 'react';
import { HeroSection, ExpertiseSection, ProjectsSection, VentureSection } from '../../components/sections';
import { AIAssistantSection } from '../../features/ai-assistant';

const Home = () => {
  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <ProjectsSection />
      <VentureSection />
      
      {/* Add AI Assistant Section */}
      <AIAssistantSection />
    </>
  );
};

export default Home;


// ============================================
// OPTION 2: As Separate Route
// ============================================

// File: src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home/Home';
import { AIAssistantSection } from './features/ai-assistant';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-assistant" element={<AIAssistantSection />} />
          {/* Add to navigation menu */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


// ============================================
// OPTION 3: Conditionally Show (Feature Flag)
// ============================================

// File: src/pages/Home/Home.jsx
import React, { useState } from 'react';
import { HeroSection, ExpertiseSection, ProjectsSection } from '../../components/sections';
import { AIAssistantSection } from '../../features/ai-assistant';

const Home = () => {
  const showAIAssistant = true; // Feature flag - set to false to hide

  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <ProjectsSection />
      
      {showAIAssistant && <AIAssistantSection />}
    </>
  );
};


// ============================================
// OPTION 4: Export from sections index
// ============================================

// File: src/components/sections/index.js
export { default as HeroSection } from './HeroSection';
export { default as ExpertiseSection } from './ExpertiseSection';
export { default as ProjectsSection } from './ProjectsSection';
export { default as VentureSection } from './VentureSection';

// Add AI Assistant
export { AIAssistantSection } from '../../features/ai-assistant';


// Then use in Home.jsx:
// import { HeroSection, ExpertiseSection, AIAssistantSection } from '../../components/sections';


// ============================================
// Testing in Development
// ============================================

// Quick test - add to App.jsx temporarily:
import { AIAssistantSection } from './features/ai-assistant';

function App() {
  return (
    <div>
      <AIAssistantSection />
    </div>
  );
}


// ============================================
// Console Logging for Debugging
// ============================================

/*
When you interact with the UI, you'll see console logs:

📤 Sending message: "Your message here"
🤖 AI would process this message...
✅ Message sent (UI-only demo - no actual AI)

🎯 Quick prompt clicked: AI Projects

⚡ Enable Local AI clicked
(UI-only demo - actual implementation would initialize WebLLM)

📐 View Architecture clicked
*/


// ============================================
// Customizing Mock Data
// ============================================

// To change the initial messages, edit:
// src/features/ai-assistant/data/mockMessages.js

// To change quick prompts, edit:
// src/features/ai-assistant/data/quickPrompts.js

// To change architecture content, edit:
// src/features/ai-assistant/data/architectureData.js

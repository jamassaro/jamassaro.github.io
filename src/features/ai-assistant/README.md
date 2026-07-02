# AI Portfolio Assistant

## 📋 Overview

Interactive AI assistant UI component for portfolio websites. This is a **UI-only implementation** that demonstrates a local AI chat interface with architecture documentation panel.

**Note**: This does NOT include actual AI implementation. It's a production-ready UI shell for future AI integration.

## ✨ Features

- **Chat Interface**: Full-featured chat window with message history
- **Quick Prompts**: Pre-configured question buttons for easy interaction
- **Architecture Panel**: Displays RAG pipeline and tech stack information
- **Responsive Design**: Mobile-first, works on all screen sizes
- **i18n Support**: English and Spanish translations included
- **Accessibility**: ARIA labels and keyboard navigation
- **Terminal Aesthetic**: Matches cyber/minimalist developer theme

## 📁 Project Structure

```
src/features/ai-assistant/
├── components/
│   ├── AIAssistantSection/     # Main container component
│   ├── AIChatWindow/            # Chat interface with header
│   ├── AIChatInput/             # Message input with action buttons
│   ├── AIMessage/               # Individual message bubble
│   ├── QuickPromptList/         # Scrollable prompt buttons
│   ├── ArchitecturePanel/       # Right panel with pipeline info
│   ├── PipelineStep/            # Numbered step component
│   ├── TechBadge/               # Technology badge component
│   └── index.js                 # Component exports
├── hooks/
│   ├── useChat.js               # Chat state management
│   ├── useScroll.js             # Auto-scroll functionality
│   └── index.js                 # Hook exports
├── types/
│   └── chat.types.js            # Type definitions and constants
├── data/
│   ├── mockMessages.js          # Sample chat messages
│   ├── quickPrompts.js          # Quick prompt configuration
│   ├── architectureData.js      # Pipeline and tech stack data
│   └── index.js                 # Data exports
└── index.js                     # Main feature export
```

## 🚀 Usage

### Basic Integration

```jsx
import { AIAssistantSection } from './features/ai-assistant';

function App() {
  return (
    <div>
      {/* Your existing sections */}
      <HeroSection />
      <ExpertiseSection />
      <ProjectsSection />
      
      {/* Add AI Assistant */}
      <AIAssistantSection />
      
      <Footer />
    </div>
  );
}
```

### As a Separate Route

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AIAssistantSection } from './features/ai-assistant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ai-assistant" element={<AIAssistantSection />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🎨 Component Architecture

### Component Hierarchy

```
AIAssistantSection
├── AIChatWindow
│   ├── Header (with status badge)
│   ├── Messages Container
│   │   └── AIMessage (multiple)
│   ├── QuickPromptList
│   │   └── Prompt Buttons
│   └── AIChatInput
│       ├── Textarea with auto-resize
│       └── Action Buttons (Enable AI, View Architecture)
└── ArchitecturePanel
    ├── Terminal Header
    ├── PipelineStep (multiple)
    ├── TechBadge (multiple)
    └── How It Works Section
```

### Single Responsibility Principle (SRP)

Each component has ONE clear responsibility:

- `AIAssistantSection`: Layout orchestration and state management
- `AIChatWindow`: Chat interface layout and message display
- `AIChatInput`: User input handling and action buttons
- `AIMessage`: Individual message rendering
- `QuickPromptList`: Prompt button list management
- `ArchitecturePanel`: Technical documentation display
- `PipelineStep`: Single pipeline step rendering
- `TechBadge`: Technology/feature badge rendering

### Custom Hooks

- `useChat`: Manages chat state, message sending, loading states
- `useScroll`: Handles auto-scrolling to bottom on new messages

## 🎯 Console Logging

All interactive actions log to console for debugging:

```javascript
// Sending a message
📤 Sending message: "What AI projects has Jose built?"
🤖 AI would process this message...
✅ Message sent (UI-only demo - no actual AI)

// Clicking quick prompts
🎯 Quick prompt clicked: AI Projects

// Action buttons
⚡ Enable Local AI clicked
📐 View Architecture clicked
```

## 🎨 Styling

Uses **CSS Modules** following existing portfolio design system:

- Design tokens from `globals.css`
- Cyber/terminal aesthetic with monospace fonts
- Glassmorphism effects
- Cyan and emerald accent colors
- Smooth animations and transitions

### Key CSS Variables Used

```css
--color-surface-container-low
--color-outline-variant
--color-primary-fixed-dim (cyan)
--color-secondary-fixed-dim (emerald)
--font-mono (JetBrains Mono)
--font-inter (Inter)
--font-geist (Geist)
```

## 📱 Responsive Design

**Fully responsive with 5+ breakpoints** optimized for all devices from 320px to 4K displays.

### Breakpoints Overview

| Device | Width | Layout | Key Features |
|--------|-------|--------|--------------|
| **Large Desktop** | >1200px | Two-column (60/40) | Maximum spacing, sticky architecture |
| **Desktop** | 1024-1200px | Two-column (65/35) | Standard layout, full features |
| **Tablet** | 768-1024px | Two-column (75/25) | Balanced, touch-friendly |
| **Small Tablet** | 768-900px | Single column | Architecture below chat |
| **Large Mobile** | 480-768px | Single column | Touch-optimized, full-width buttons |
| **Small Mobile** | 320-480px | Single column | Compact, maximum width usage |
| **Landscape** | <900px landscape | Optimized horizontal | Compact vertical spacing |

### Key Responsive Features

✅ **Adaptive Layout**: Two-column → Single column at 900px breakpoint  
✅ **Touch Optimization**: 44px minimum touch targets on mobile (WCAG AAA)  
✅ **Typography Scaling**: 36px → 18px section titles across breakpoints  
✅ **Spacing Optimization**: 120px → 48px section padding for mobile  
✅ **Architecture Panel**: Toggleable on tablet/mobile, sticky on desktop  
✅ **Action Buttons**: Side-by-side on desktop, stacked full-width on mobile  
✅ **iOS Compatible**: 16px input fonts prevent zoom, safe area support  
✅ **Landscape Mode**: Special handling for height-constrained displays  
✅ **Performance**: Hardware-accelerated animations, optimized scroll  

### Mobile-Specific Enhancements

- **Chat Height**: Scales from 700px (desktop) → 500px (small mobile) → 450px (landscape)
- **Message Widths**: Expands from 85-90% (desktop) to 92-98% (mobile) for better readability
- **Quick Prompts**: Horizontal scroll with touch-optimized button sizes
- **Input Area**: Full-width stacked buttons with 44px touch targets
- **Terminal Aesthetics**: Maintained across all sizes with adaptive dot sizes (10px → 8px)

### Documentation

- 📱 [**MOBILE_TABLET.md**](./MOBILE_TABLET.md) - Comprehensive implementation guide
- 📊 [**MOBILE_TABLET_SUMMARY.md**](./MOBILE_TABLET_SUMMARY.md) - Complete feature summary
- ⚡ [**MOBILE_TABLET_QUICK_REF.md**](./MOBILE_TABLET_QUICK_REF.md) - Quick reference for developers

## 🌐 i18n Integration

Translations added to both English and Spanish:

```javascript
t('ai-assistant.title') // ASK_MY_PORTFOLIO / LOCAL_AI_DEMO
t('ai-assistant.description') // Full description
t('ai-assistant.input-placeholder') // Input placeholder text
```

## 📝 Mock Data

### Messages
Located in `data/mockMessages.js` - 4 sample messages showing conversation flow

### Quick Prompts
Located in `data/quickPrompts.js` - 6 prompts:
- AI Projects
- React Experience
- GCP / Cloud
- Architecture
- Startup Experience
- Interview Me

### Architecture Data
Located in `data/architectureData.js`:
- 5 pipeline steps
- 5 tech stack badges
- 3 feature badges
- How it works content

## 🔧 Customization

### Change Mock Messages

Edit `/data/mockMessages.js`:

```javascript
export const mockMessages = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Your custom question',
    timestamp: new Date(),
  },
  // ... more messages
];
```

### Add/Remove Quick Prompts

Edit `/data/quickPrompts.js`:

```javascript
export const quickPrompts = [
  {
    id: 'prompt-1',
    label: 'Your Label',
    prompt: 'Full prompt text to send',
  },
];
```

### Modify Pipeline Steps

Edit `/data/architectureData.js`:

```javascript
export const pipelineSteps = [
  {
    number: 1,
    label: 'Your custom step',
  },
];
```

## 🚀 Future Integration (When Adding Real AI)

When you're ready to add actual AI functionality:

1. Replace `useChat` hook logic with real API calls
2. Install WebLLM or your chosen AI library
3. Update `sendMessage` to call AI model
4. Handle streaming responses
5. Add error handling and retry logic
6. Update loading states appropriately

## 📊 Component Metrics

- **Total Files**: 26
- **Total Components**: 8
- **Custom Hooks**: 2
- **Lines of Code**: ~1,500
- **Largest Component**: AIChatWindow (~120 lines)
- **Average Component Size**: ~60 lines

## ✅ Code Quality

- ✅ Single Responsibility Principle (SRP)
- ✅ Don't Repeat Yourself (DRY)
- ✅ PropTypes validation
- ✅ Accessibility (ARIA labels)
- ✅ Responsive design
- ✅ No inline styles
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Clean component decomposition

## 🎓 Key Learning Points

1. **Component Decomposition**: Each component < 200 lines
2. **State Management**: Centralized in custom hooks
3. **Data Separation**: Mock data in separate files
4. **Type Safety**: JSDoc type definitions
5. **CSS Architecture**: Modular, reusable styles
6. **Accessibility**: Proper ARIA and keyboard support

## 📄 License

Part of Jose A. Massaro's portfolio project.

---

**Built with precision** 🎯

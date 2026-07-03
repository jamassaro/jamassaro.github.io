# Conversation Architecture - Visual Diagrams

## System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         React Layer                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │          AIAssistantSection Component                   │    │
│  │  • Renders chat window, input, prompts                  │    │
│  │  • Consumes useConversation hook                        │    │
│  └───────────────────────┬────────────────────────────────┘    │
└────────────────────────────┼───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                    Custom Hooks Layer                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │           useConversation (Orchestrator)              │      │
│  │  • Main API for components                            │      │
│  │  • Coordinates all sub-hooks                          │      │
│  │  • Manages conversation lifecycle                     │      │
│  └─────────┬──────────┬──────────┬──────────┬──────────┘      │
│            │          │          │          │                   │
│  ┌─────────▼───┐  ┌──▼─────┐ ┌─▼────────┐ ┌▼──────────────┐  │
│  │useMessages  │  │useTyping│ │usePrompts│ │useHistory     │  │
│  │• CRUD ops   │  │• animate│ │• suggest │ │• persist      │  │
│  └─────────────┘  └─────────┘ └──────────┘ └───────────────┘  │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                   Business Logic Layer                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │          ConversationManager (Class)                  │      │
│  │  • Core conversation logic                            │      │
│  │  • WebLLM integration point (future)                  │      │
│  │  • Knowledge search integration                       │      │
│  └─────────┬──────────┬──────────┬──────────────────────┘      │
│            │          │          │                              │
│  ┌─────────▼───┐  ┌──▼─────┐ ┌─▼────────┐                     │
│  │Response     │  │Prompt  │ │Context   │                     │
│  │Generator    │  │Builder │ │Builder   │                     │
│  └─────────────┘  └────────┘ └──────────┘                     │
└────────────────────────────┬───────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                     Knowledge Layer                             │
│  • Search System (✅ Complete)                                  │
│  • Knowledge Base (✅ Complete)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Flow Diagram

```
User Action → useConversation → ConversationManager → Knowledge Search
     │              │                    │                    │
     │              │                    │                    ▼
     │              │                    │            Search Results
     │              │                    │                    │
     │              │                    ▼                    │
     │              │           Generate Response  ◄──────────┘
     │              │                    │
     │              │                    ▼
     │              │           Update State (dispatch)
     │              │                    │
     │              ▼                    ▼
     │       Update UI State    Add Assistant Message
     │              │                    │
     │              ▼                    ▼
     └──────► Start Typing ──────► Animate Text
                    │
                    ▼
              Complete Message
                    │
                    ▼
          Update Suggestions
                    │
                    ▼
            Save to History
```

---

## Hook Dependency Graph

```
                    useConversation
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
useConversationState  useMessages   useSuggestedPrompts
        │                                   │
        │                                   │
        └──────────┬────────────────────────┘
                   │
                   ▼
          conversationReducer
                   │
                   ▼
          ConversationManager
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   Knowledge  Response   Context
    Search    Generator  Builder
```

---

## Data Flow: User Sends Message

```
┌─────────────┐
│   User      │
│ Types Msg   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  sendMessage()   │  ← useConversation hook
└──────┬───────────┘
       │
       ▼
┌─────────────────────────┐
│ Dispatch:               │
│ ADD_USER_MESSAGE        │
└──────┬──────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ ConversationManager          │
│ .processMessage()            │
│                              │
│  1. Search Knowledge ────────┼──► Knowledge Search
│  2. Build Context            │         │
│  3. Generate Response ◄──────┼─────────┘
│  4. Update Suggestions       │
└──────┬───────────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Dispatch:               │
│ START_TYPING            │
└──────┬──────────────────┘
       │
       ▼
┌──────────────────────────┐
│ useTypingAnimation       │
│ Animates text char-by-   │
│ char (30ms interval)     │
└──────┬───────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Dispatch:               │
│ FINISH_TYPING           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Update Suggestions      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Save to localStorage    │
└─────────────────────────┘
```

---

## State Transitions

```
┌──────┐  sendMessage   ┌─────────┐  search complete  ┌────────┐
│ IDLE ├───────────────►│ LOADING ├──────────────────►│ TYPING │
└──┬───┘                └─────────┘                   └───┬────┘
   │                                                       │
   │ resetConversation                     typing complete │
   │                                                       │
   └◄──────────────────────────────────────────────────────┘
   
   
        ERROR state (any point)
             │
             ▼
        ┌─────────┐  clearError  ┌──────┐
        │  ERROR  ├──────────────►│ IDLE │
        └─────────┘               └──────┘
```

---

## Message Lifecycle

```
User Message:
┌─────────┐     ┌─────────┐     ┌──────────┐
│ PENDING ├────►│ SENDING ├────►│ COMPLETE │
└─────────┘     └─────────┘     └──────────┘
                     │
                     ▼
                ┌────────┐
                │ ERROR  │
                └────────┘


Assistant Message:
┌─────────┐     ┌────────────┐     ┌──────────┐
│ PENDING ├────►│ STREAMING  ├────►│ COMPLETE │
└─────────┘     └────────────┘     └──────────┘
                      │
                      ▼
                 ┌────────┐
                 │ ERROR  │
                 └────────┘
```

---

## WebLLM Integration Points (Future)

```
                ConversationManager
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
   Initialize      Generate        Stream
   WebLLM         Response        Chunks
        │               │               │
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌────────────┐ ┌─────────────┐
│ Load Model   │ │ Call LLM   │ │ Process     │
│ (one-time)   │ │ with       │ │ streaming   │
│              │ │ context    │ │ response    │
└──────────────┘ └────────────┘ └─────────────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
                Update UI State
                        │
                        ▼
                Display to User
```

---

## Component-Hook Connection

```
┌─────────────────────────────────────────────────┐
│          AIAssistantSection.jsx                 │
│                                                  │
│  const {                                         │
│    messages,          ◄─── useMessages          │
│    isTyping,          ◄─── useTypingAnimation   │
│    isLoading,         ◄─── useConversationState │
│    suggestedPrompts,  ◄─── useSuggestedPrompts  │
│    sendMessage,       ◄─── useConversation      │
│    selectPrompt,      ◄─── useSuggestedPrompts  │
│  } = useConversation();                          │
│                                                  │
│  return (                                        │
│    <div>                                         │
│      <AIChatWindow messages={messages} />       │
│      <QuickPromptList prompts={prompts} />      │
│      <AIChatInput onSend={sendMessage} />       │
│    </div>                                        │
│  )                                               │
└──────────────────────────────────────────────────┘
```

---

## Persistence Strategy

```
┌──────────────────┐
│  Conversation    │
│     State        │
└────────┬─────────┘
         │
         │ Save on:
         │ • New message
         │ • Conversation end
         │
         ▼
┌──────────────────────────┐
│   localStorage           │
│                          │
│   Key: "conversations"   │
│   Format: JSON           │
│                          │
│   {                      │
│     [id]: {              │
│       messages: [],      │
│       metadata: {},      │
│       timestamp: ""      │
│     }                    │
│   }                      │
└──────────────────────────┘
         │
         │ Load on:
         │ • Mount
         │ • User request
         │
         ▼
┌──────────────────┐
│  Conversation    │
│   Restored       │
└──────────────────┘
```

---

## Error Handling Flow

```
┌──────────────┐
│ Error Occurs │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Determine Error Type     │
└──────┬───────────────────┘
       │
       ├──► Network Error ───────► Retry Logic
       │
       ├──► Search Error ─────────► Fallback Response
       │
       ├──► LLM Error ────────────► Mock Response
       │
       └──► Unknown ──────────────► Generic Error Message
                                          │
                                          ▼
                                    ┌──────────────┐
                                    │ Display to   │
                                    │ User         │
                                    └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Allow Retry  │
                                    │ or Continue  │
                                    └──────────────┘
```

---

## Typing Animation Mechanism

```
Full Text: "Hello, how can I help you?"
           ↓
┌─────────────────────────────────────────┐
│ Split into chars array:                 │
│ ['H','e','l','l','o',',',' ','h',...]   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ useTypingAnimation:                     │
│                                         │
│ currentIndex = 0                        │
│ displayText = ""                        │
│                                         │
│ setInterval(() => {                     │
│   displayText += chars[currentIndex]    │
│   currentIndex++                        │
│ }, 30ms)                                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Update UI progressively:                │
│                                         │
│ Render 1: "H"                           │
│ Render 2: "He"                          │
│ Render 3: "Hel"                         │
│ ...                                     │
│ Render N: "Hello, how can I help you?"  │
└─────────────────────────────────────────┘
```

---

## Suggestion Generation Logic

```
┌──────────────────────────────────────┐
│   Conversation Context               │
│   • Last 3 messages                  │
│   • Search results from last query   │
│   • User's language preference       │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Analyze Context                    │
│   • Extract topics mentioned         │
│   • Identify gaps in knowledge       │
│   • Consider follow-up questions     │
└──────────────┬───────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌──────────────┐
│ Static  │         │  Contextual  │
│ Prompts │         │   Prompts    │
│ (Base)  │         │  (Dynamic)   │
└────┬────┘         └──────┬───────┘
     │                     │
     └──────────┬──────────┘
                │
                ▼
┌──────────────────────────────────────┐
│   Rank & Filter                      │
│   • Relevance score                  │
│   • Max 4 prompts                    │
│   • Avoid duplicates                 │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Display to User                    │
│   [Prompt 1] [Prompt 2]              │
│   [Prompt 3] [Prompt 4]              │
└──────────────────────────────────────┘
```

---

## Memory Management

```
┌────────────────────────────────┐
│  Conversation History          │
│  (Unlimited in state)          │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Trim for Context              │
│  • Keep last 5 messages        │
│  • Or last 2048 tokens         │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  Send to LLM                   │
│  (Smaller context = faster)    │
└────────────────────────────────┘


┌────────────────────────────────┐
│  localStorage                  │
│  • Keep last 10 conversations  │
│  • Max 1MB total               │
│  • Prune old on overflow       │
└────────────────────────────────┘
```

---

**Visual Reference Complete** ✅

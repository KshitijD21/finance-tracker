# 🎙️ FinChat - AI-Powered Conversational Expense Tracker

> **Stop filling forms. Start talking.**
> FinChat is an AI-powered expense tracker that understands natural conversation. Just say "I spent $50 on coffee" and the AI automatically categorizes, stores, and tracks it.

[![Built with Cloudflare](https://img.shields.io/badge/Built%20with-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Powered by Workers AI](https://img.shields.io/badge/Powered%20by-Workers%20AI-F38020)](https://ai.cloudflare.com/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🚨 The Problem

Manual expense tracking is **tedious and time-consuming**:

- 😫 Users hate filling out forms
- 📝 Manual categorization is annoying
- 🔍 Finding past expenses is difficult
- 📊 No easy way to ask questions about spending
- ⏰ Takes **5-10 minutes per day**

### Existing Solutions Fall Short

Traditional apps like Mint, YNAB, and Copilot require:

- ❌ Manual data entry
- ❌ Manual categorization
- ❌ Complex UI navigation
- ❌ Bank integration (privacy concerns)

---

## 💡 The Solution: FinChat

**"What if you could just TALK to your expense tracker?"**

FinChat is an AI-powered expense tracker that you control entirely through conversation. Just say "I spent $50 on coffee" and the AI automatically categorizes, stores, and tracks it. Ask "How much did I spend on food?" and get instant answers.

**It's like having a personal financial assistant in your pocket.**

### ✨ Key Features

| Feature                       | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| 🎙️ **Natural Voice Input**    | Speak naturally - no forms, no buttons                  |
| 🤖 **AI Auto-Categorization** | Automatically understands and categorizes expenses      |
| 💬 **Conversational Queries** | Ask questions like "How much did I spend on food?"      |
| 🗑️ **Voice-Powered Deletion** | Delete expenses by voice: "Delete my coffee expense"    |
| ⚡ **Lightning Fast**         | 30 seconds vs 5 minutes                                 |
| 🔒 **Privacy First**          | Your data stays with you - no bank integration required |
| 🌍 **Global Edge Deployment** | Fast response times worldwide via Cloudflare's network  |

---

## 🎯 Key Innovation

### **Conversational Interface + AI Intelligence**

Traditional apps make **YOU** adapt to **THEM**.
FinChat adapts to **YOU** - you just speak naturally.

**Example Interactions:**

```
You: "I spent $50 on coffee at Starbucks"
FinChat: ✅ Got it! Added $50 for coffee at Starbucks

You: "How much did I spend on food this week?"
FinChat: 💰 You spent $287 on food this week across 12 transactions

You: "Delete my last coffee expense"
FinChat: 🗑️ Deleted $50 coffee expense from Starbucks
```

---

## 🏗️ Architecture & Tech Stack

### Cloudflare Technologies

```
┌─────────────────────────────────────────┐
│  CLOUDFLARE TECHNOLOGIES USED           │
├─────────────────────────────────────────┤
│                                         │
│  1. ☁️  CLOUDFLARE WORKERS              │
│     - Serverless backend API            │
│     - Global edge deployment            │
│     - Handles all API requests          │
│                                         │
│  2. 🤖 WORKERS AI (Llama 3.3 70B)       │
│     - Intent classification             │
│     - Expense categorization            │
│     - Natural language understanding    │
│     - Conversational query responses    │
│     - Expense deletion identification   │
│                                         │
│  3. 💾 DURABLE OBJECTS                  │
│     - Persistent data storage           │
│     - Per-user expense storage          │
│     - Strongly consistent state         │
│     - No external database needed       │
│                                         │
│  4. 🌐 PAGES (Frontend Hosting)         │
│     - React app deployment              │
│     - Global CDN delivery               │
│     - Integrated with Workers           │
│                                         │
└─────────────────────────────────────────┘
```

### Full Tech Stack

**Frontend:**

- ⚛️ React 19.1 + TypeScript 5.8
- 🎙️ Web Speech API (voice input)
- 🔊 ElevenLabs API (voice output)
- 🎨 Tailwind CSS + Framer Motion
- 🧩 Radix UI Components

**Backend:**

- 🔷 Hono Framework (lightweight, fast)
- 🤖 Workers AI - Llama 3.3 70B
- 💾 Durable Objects (persistent storage)
- 🌐 RESTful API design

**AI Capabilities:**

- Intent Classification (ADD/QUERY/DELETE/HELP)
- Natural Language Processing
- Automatic Expense Categorization
- Conversational Query Handling
- Smart Expense Deletion

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION FLOW                    │
└─────────────────────────────────────────────────────────────┘

USER SPEAKS
    ↓
Web Speech API captures voice
    ↓
Sends to /api/voice-command endpoint
    ↓
Cloudflare Worker receives request
    ↓
Workers AI classifies intent (ADD/QUERY/DELETE)
    ↓
┌─────────────────────────────────────────────────────────────┐
│ If ADD_EXPENSE:                                             │
│   → Workers AI extracts amount, merchant, category          │
│   → Saves to Durable Objects                                │
│   → Returns friendly confirmation                           │
├─────────────────────────────────────────────────────────────┤
│ If QUERY:                                                   │
│   → Fetches expenses from Durable Objects                   │
│   → Workers AI generates natural language answer            │
│   → Returns conversational response                         │
├─────────────────────────────────────────────────────────────┤
│ If DELETE:                                                  │
│   → Workers AI identifies which expense                     │
│   → Deletes from Durable Objects                            │
│   → Confirms deletion                                       │
└─────────────────────────────────────────────────────────────┘
    ↓
Response sent to frontend
    ↓
ElevenLabs speaks response
    ↓
UI updates in real-time
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Cloudflare account (free tier works!)
- ElevenLabs API key (optional, for voice output)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KshitijD21/finance-tracker.git
   cd finance-tracker
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Add your ElevenLabs API key to your environment (optional):

   ```bash
   # Add to your shell profile or .env.local
   export VITE_ELEVENLABS_API_KEY=your_api_key_here
   ```

4. **Run development server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

### Deployment

Deploy to Cloudflare Pages + Workers:

```bash
pnpm run deploy
```

This will:

1. Build the React frontend
2. Deploy the frontend to Cloudflare Pages
3. Deploy the backend Worker
4. Set up Durable Objects and Workers AI bindings

---

## 📁 Project Structure

```
finance-tracker/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── VoiceMode.tsx        # Voice interaction component
│   │   ├── ChatSection.tsx      # Chat interface
│   │   ├── ExpensesSection.tsx  # Expense list view
│   │   └── ui/                  # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useVoiceConversation.ts  # Voice conversation logic
│   │   ├── useSpeechRecognition.ts  # Web Speech API wrapper
│   │   └── useElevenLabs.ts     # ElevenLabs TTS integration
│   ├── lib/                     # Utility functions
│   │   ├── api.ts               # API client
│   │   └── utils.ts             # Helper functions
│   └── types/                   # TypeScript type definitions
│
├── worker/                       # Cloudflare Worker backend
│   ├── index.ts                 # Main Worker entry point
│   ├── ai/                      # AI processing logic
│   │   ├── classify-intent.ts  # Intent classification
│   │   ├── parse-expense.ts    # Expense parsing
│   │   ├── query-expenses.ts   # Query processing
│   │   ├── delete-expense.ts   # Deletion logic
│   │   └── prompts/            # AI prompts
│   ├── durable-objects/        # Durable Objects
│   │   └── FinanceMemory.ts   # Expense & chat storage
│   └── types/                  # Worker type definitions
│
├── wrangler.jsonc              # Cloudflare Worker configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

---

## 🤖 AI Features Deep Dive

### 1. Intent Classification

The AI automatically identifies what you want to do:

- **ADD_EXPENSE**: "I spent $50 on coffee"
- **QUERY**: "How much did I spend on food?"
- **DELETE**: "Delete my last coffee expense"
- **HELP**: "What can you do?"

### 2. Expense Parsing

When adding an expense, the AI extracts:

- **Amount**: Dollar value
- **Merchant**: Where you spent it
- **Category**: Auto-categorized (Food, Transport, Entertainment, etc.)

### 3. Natural Language Queries

Ask questions naturally:

- "How much did I spend this week?"
- "What did I spend on food?"
- "Show me my coffee expenses"
- "How much was my Uber ride?"

### 4. Smart Deletion

Delete expenses conversationally:

- "Delete my last coffee expense"
- "Remove all food expenses from yesterday"
- "Delete the $50 Starbucks charge"

---

## 🔌 API Endpoints

### Voice Command (Primary Interface)

```http
POST /api/voice-command
Content-Type: application/json

{
  "userId": "user-123",
  "input": "I spent $50 on coffee"
}
```

### Add Expense (Manual)

```http
POST /api/expense-natural
Content-Type: application/json

{
  "userId": "user-123",
  "input": "Spent $50 on lunch at Chipotle"
}
```

### Get Expenses

```http
GET /api/expenses/:userId
```

### Chat History

```http
GET /api/chat/:userId
POST /api/chat/:userId
DELETE /api/chat/:userId
```

---

## 🎨 UI Components

### Voice Mode

- Real-time audio visualization
- Speaking/listening states
- Animated mic button
- ElevenLabs voice responses

### Chat Section

- Message bubbles (user/assistant)
- Expense cards with metadata
- Scroll to bottom on new messages

### Expenses Section

- Categorized expense cards
- Summary statistics
- Filter and search capabilities

---

## 🔒 Privacy & Security

- ✅ **No bank integration required** - manual entry only
- ✅ **User-specific data isolation** - Durable Objects per user
- ✅ **No third-party data sharing** - all data in Cloudflare
- ✅ **Edge computing** - data processed close to you
- ✅ **Minimal data retention** - only what you add

---

## 🌟 Why Cloudflare?

### Workers AI (Llama 3.3 70B)

- Zero cold starts
- No model management
- Pay-per-request pricing
- Global inference at the edge

### Durable Objects

- Strongly consistent storage
- No database setup
- Automatic scaling
- Built-in state management

### Workers

- Deploy globally in seconds
- Millisecond response times
- No infrastructure management
- Free tier for development

---

## 🛣️ Roadmap

- [ ] Multi-currency support
- [ ] Receipt photo uploads
- [ ] Budget tracking & alerts
- [ ] Export to CSV/PDF
- [ ] Recurring expense detection
- [ ] Mobile app (React Native)
- [ ] Shared expense tracking (roommates/families)
- [ ] Integration with banking APIs (optional)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [Workers AI](https://ai.cloudflare.com/) - AI inference at the edge
- [ElevenLabs](https://elevenlabs.io/) - Natural voice synthesis
- [Hono](https://hono.dev/) - Lightweight web framework
- [Radix UI](https://www.radix-ui.com/) - Accessible components

---

## 📧 Contact

**Kshitij** - [@KshitijD21](https://github.com/KshitijD21)

Project Link: [https://github.com/KshitijD21/finance-tracker](https://github.com/KshitijD21/finance-tracker)

---

<div align="center">

**Built with ❤️ using Cloudflare Workers AI**

Made by [Kshitij](https://github.com/KshitijD21)

</div>

# 🧠 StudyAI — AI-Powered Study Assistant

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Free AI](https://img.shields.io/badge/AI-Groq%20Free-00A67E?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss)

> Upload your study material and instantly get AI-generated summaries, flashcards, and quizzes — completely free!

---

## ✨ Features

| Feature | Details |
|---|---|
| 📄 PDF Upload | Extract text from PDFs automatically |
| 📝 Text Paste | Paste raw notes directly |
| 🧠 Summarization | TL;DR + detailed summary + key points |
| 🃏 Flashcards | 10–15 flip-cards with mark-known tracking |
| ❓ Quiz | 5–20 MCQs + short answer with scoring |
| 💬 Chat with Notes | Ask AI anything about your material |
| 🌙 Dark Mode | Beautiful dark UI built with Tailwind CSS |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/abhiraj-mk/study-assistant.git
cd study-assistant
npm run install-all
```

### 2. Set up environment variables

Create a file called `.env` inside the `server/` folder and paste this:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=supersecretkey123
OPENAI_API_KEY=your-groq-api-key-here
OPENAI_MODEL=llama-3.3-70b-versatile
CLIENT_URL=http://localhost:5173
```

### 3. Run the app

```bash
npm run dev
```

Open **http://localhost:5173** in your browser 🎉

---

## 🔑 Getting a FREE API Key (Groq)

This project uses **Groq** — completely free, no credit card needed!

1. Go to **console.groq.com**
2. Sign up with Google
3. Click **"API Keys"** → **"Create API Key"**
4. Copy and paste in `server/.env` as `OPENAI_API_KEY=`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI | Groq API (Llama 3.3 70B) — Free |
| State Management | Zustand |
| File Upload | Multer (in-memory) |
| PDF Parsing | pdf-parse |

---

## 📁 Project Structure

```
study-assistant/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Upload, Summary, Flashcards, Quiz, Chat, Navbar
│       ├── pages/           # Dashboard, DocumentView
│       ├── services/api.js  # All API calls
│       └── store/           # Zustand global state
├── server/                  # Node.js + Express backend
│   ├── controllers/         # AI, Upload logic
│   ├── routes/              # Express routes
│   ├── services/            # Groq AI service, PDF parser
│   ├── models/              # MongoDB schemas (optional)
│   └── middleware/          # JWT auth middleware
└── package.json             # Root scripts
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload PDFs/TXT (up to 10 files) |
| POST | `/api/upload/text` | Paste raw text |
| POST | `/api/ai/summarize` | Generate summary |
| POST | `/api/ai/quiz` | Generate quiz (pass `count: 1–20`) |
| POST | `/api/ai/flashcards` | Generate flashcards |
| POST | `/api/ai/chat` | Q&A with notes |
| POST | `/api/ai/all` | Run summary + quiz + flashcards at once |
| GET | `/api/health` | Server health check |

---

## 🗄️ MongoDB (Optional)

MongoDB is optional. Without it the app works perfectly — data just resets on refresh.

To enable, add to `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/study-assistant
```

> 💡 Note: Some Indian ISPs (Reliance/Jio fiber) block MongoDB Atlas DNS. Use mobile hotspot if you face connection issues.

---

## ⚠️ Known Limitations

- **Images (JPEG/PNG):** Not supported with free Groq. Use PDF or paste text instead.
- **Data persistence:** Without MongoDB, data resets on browser refresh.
- **Rate limits:** Groq free tier has generous but limited requests per minute.

> To enable image support, switch to OpenAI GPT-4o by updating `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-4o` in `.env`

---

## 🚀 Deployment

| Service | Use for |
|---|---|
| **Vercel** | Deploy `client/` frontend (free) |
| **Render / Railway** | Deploy `server/` backend (free) |
| **MongoDB Atlas** | Free cloud database |

---

## 🛡️ Security Notes

- Never commit `.env` to Git — already in `.gitignore`
- Rate limiting: 10 AI requests/min per IP
- Keep your API key private

---

## 📈 Future Plans

- [ ] MongoDB for saving document history
- [ ] Image support via OpenAI GPT-4o Vision
- [ ] Spaced repetition for flashcards
- [ ] Voice input support
- [ ] PWA offline mode
- [ ] Collaboration / group study rooms

---

## 👨‍💻 Author

Made by **Abhiraj Sinha**

---

## ⭐ Show your support

Give a ⭐ if this project helped you study better!
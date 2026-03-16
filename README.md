# Buba-App — BubaMemoir

🌐 **Live App**: [https://ghanashyam-neupane.vercel.app](https://ghanashyam-neupane.vercel.app)

## 🧠 Motivation

My father, at 83 years, has an inspiring passion for technology. Whether he's exploring the internet, drafting chapters of his autobiography, or curating cherished family photos and videos, his enthusiasm for learning and creating is truly remarkable.

Yet, he lacked a dedicated digital space — a personal archive where he could safely preserve, organize, and share his life's work.

This project was born from that need.

I built this platform as a heartfelt gift to him — a secure, cloud-powered space where he can store his writings, manage multimedia content, and revisit his memories with ease. It’s more than just a content management app; it’s a digital legacy hub tailored for someone who proves that the love of learning knows no age.

---

## ✨ Features

✅ User Authentication with next-auth (JWT-based)

📦 MongoDB Integration using mongoose

⚡ Redis Caching (via Upstash) for faster content delivery

☁️ Cloudinary for image and video uploads

📃 Content CRUD: Create, View, Edit, Delete text and multimedia content

🧠 Cache Invalidation logic for consistency between DB and cache

🌄 Image Management with Cloudinary API

🗃️ Framer Motion for smooth, animated UI interactions

🧭 Bikram-Sambat Date Support with bikram-sambat-js for localized Nepali date handling

🪶 Lucide React icons for a clean and elegant UI

🔐 Role-based Access Control (Admin-only content deletion, etc.)

🧹 Centralized Error Handling using catchAsyncErrors middleware

🌐 API Routes built using Next.js App Router structure

### 🔐 Authentication

- Built with `NextAuth.js` using:
  - `CredentialsProvider` for email/password login
  - `GoogleProvider` for Google login
- User session is required for uploading images and accessing AI chat.

#### 2. OpenAI Chat (AI Assistant)

GitHub Backend Repo: [Chatbot Flask](https://github.com/khemrajneupane/chatbot-flask/blob/main/app.py)

- Python Flask backend integrated with OpenAI’s GPT-3.5-turbo model
- Available only to logged-in users
- Prompt-based AI responses (max 50 tokens)
- Ideal for fun interactions, questions, or assistance

---

## 🛠️ Tech Stacks

    Frontend: Next.js 15 (App Router)

    Backend: Node.js (API Routes)

    Database: MongoDB + Mongoose

    Cache: Redis (Upstash)

    Auth: NextAuth.js

    Cloud Storage: Cloudinary

    UI Enhancements: Framer Motion, Lucide React

    Date Utilities: Bikram Sambat JS

    Styling: Tailwind CSS

    Deployment: Vercel

### External Chat Backends

- **OpenAI Chat Backend**: Python + Flask + OpenAI API

---

## 📦 Dependencies

```json
"dependencies": {
    "axios": "^1.9.0",
    "bcryptjs": "^3.0.2",
    "bikram-sambat-js": "^1.0.2",
    "bootstrap": "^5.3.6",
    "cloudinary": "^2.6.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.15.0",
    "ioredis": "^5.6.1",
    "lucide-react": "^0.511.0",
    "mongodb": "^6.16.0",
    "mongoose": "^8.14.1",
    "next": "15.3.1",
    "next-auth": "^4.24.11",
    "next-connect": "^1.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.5.2",
    "react-icons": "^5.5.0",
    "react-image-gallery": "^1.4.0",
    "react-toastify": "^11.0.5",
    "socket.io-client": "^4.8.1"
}
```

## 🚀 Getting Started Locally

### Keep following .env.local file

- API_URL=""
- CLOUDINARY_API_KEY=""
- CLOUDINARY_API_SECRET=""
- CLOUDINARY_CLOUD_NAME=""
- DB_URI=""
- GOOGLE_CLIENT_ID=""
- GOOGLE_CLIENT_SECRET=""
- JWT_SECRET=""
- NEXTAUTH_SECRET=""
- NEXTAUTH_URL=""
- REDIS_URL=""

```
git clone https://github.com/khemrajneupane/buba-app.git
cd buba-app
npm install
npm run dev

```

## 🔗 Links

- 🖼️ Live App: https://ghanashyam-neupane.vercel.app//

- 💬 Socket Chat Backend: GitHub Repo

- 🤖 OpenAI Chat Backend: GitHub Repo

# Happy coding!

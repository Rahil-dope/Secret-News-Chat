# 📰 Secret News Chat

A stealth **Progressive Web App (PWA)** that functions as a legitimate news reader while discreetly embedding a private, keyword-gated chat system.

---

## 📌 Overview

**Secret News Chat** is a disguise-first communication application.
On the surface, it behaves like a standard news aggregation app. Under the hood, it contains a private real-time chat that can only be accessed by entering a predefined secret keyword into the search bar.

<<<<<<< HEAD
- ✅ **Disguised Interface**: Appears as "News Today" - a legitimate news reading app
- 🔐 **Secret Unlock**: Hidden chat accessible only via keyword search (no visible buttons or hints)
- 💬 **Real-time Chat**: Firebase Firestore-powered instant messaging
- 🦁 **Anonymous Identities**: Users are auto-assigned fun animal names (e.g., "Happy Hippo")
- 🗑️ **Hide for Me**: Messages can be hidden individually (not deleted for everyone)
- 🔒 **Auto-Lock Security**:
  - Returns to news feed when app goes to background
  - Auto-locks after 60 seconds of inactivity
  - Back button always returns to news feed from chat
- 📱 **Progressive Web App**: Install to home screen, works offline
- 🔥 **Firebase Backend**: Authentication + Firestore real-time database
- 🎨 **Clean UI**: Mobile-first, responsive design
=======
There are **no visible indicators**, buttons, or navigation paths revealing the chat feature—access relies entirely on prior knowledge.
>>>>>>> dd9d16d390d465c8f91df60343c8196ce9c2c6a5

This project is designed as a **technical demonstration of UI deception, state control, and access gating**, not as a secure messaging platform.

---

## ✨ Core Features

### Interface & UX

* 📰 **Fully Disguised UI** — Appears as a normal news reader (“News Today”)
* 🔍 **Keyword-Based Unlock** — Chat unlocks only via secret search input
* 🎨 **Mobile-First Design** — Clean, responsive, distraction-free UI

### Chat & State Control

* 💬 **Real-Time Messaging** — Firestore-powered live chat
* 🗑️ **Hide-for-Me Messages** — Local-only message hiding (non-destructive)
* 🔄 **Instant State Reset** — Chat auto-closes under multiple conditions

### Security-by-Behavior

* 🔒 **Auto-Lock System**

  * App backgrounded
  * Browser tab loses focus
  * 60 seconds of inactivity
  * Back navigation from chat
* 🚫 **No Persistent Chat Exposure** — Always returns to news feed

### Platform

* 📱 **Progressive Web App**

  * Installable
  * Offline-capable (cached content)
  * Service Worker + Manifest support

---

## 🧱 Technology Stack

### Frontend

* **React 18** + **TypeScript**
* **Vite** (high-performance bundler)
* **Tailwind CSS** (utility-first styling)
* **React Router** (client-side routing)

### Backend

* **Firebase Authentication** (Email / Password)
* **Cloud Firestore**

  * Real-time updates
  * Offline persistence

### PWA

* **Vite PWA Plugin (Workbox)**
* Service Worker caching
* Web App Manifest

---

## ⚙️ Prerequisites

* Node.js **18+**
* npm
* Firebase account (free tier sufficient)
* Modern Chromium-based browser (recommended)

---

## 🚀 Getting Started

### 1️⃣ Installation

```bash
cd secret-news-chat
npm install
```

### 2️⃣ Firebase Configuration

Follow the detailed setup guide in [`SETUP.md`](./SETUP.md) to:

* Create a Firebase project
* Enable Email/Password authentication
* Initialize Firestore
* Configure environment variables

### 3️⃣ Environment Variables

```bash
cp .env.example .env.local
```

Populate `.env.local` with your Firebase credentials.

### 4️⃣ Development Server

```bash
npm run dev
```

Open:
👉 `http://localhost:5173`

### 5️⃣ Production Build

```bash
npm run build
npm run preview
```

---

## 🔐 Usage Guide

### End User Flow

1. **Authenticate** using email/password
2. **Browse News Feed** (default landing screen)
3. **Enter Secret Keyword** in search bar
4. **Chat Interface Unlocks**
5. **Chat Auto-Locks** on inactivity or context change

---

## 🔑 Default Secret Keyword

```
quantum2026
```

> Configurable via environment variables

```env
VITE_SECRET_KEYWORD=your_custom_keyword
```

---

## 🗑️ Message Visibility Control

* Long-press (mobile) or right-click (desktop) on a message
* Select **“Hide for me”**
* Message is removed only from your local view

---

## 🛡️ Security & Access Control

### Behavioral Lock Conditions

The app **forcibly exits chat mode** when:

* Browser tab loses focus
* App is minimized or backgrounded
* User remains inactive for 60 seconds
* Back navigation is triggered

### Access Rules

* Authentication required for all app access
* Optional UID allowlist via Firestore (`/config/allowedUsers`)
* Firestore rules enforce read/write restrictions

---

## ⚠️ Privacy & Limitations

> **Important Notice**

* This project is **not end-to-end encrypted**
* Messages are stored in Firebase Firestore
* Firebase admins retain full database access
* Intended strictly for:

  * Educational use
  * Technical demonstration
  * Portfolio review

**Not suitable for sensitive or private communications.**

---

## 🗂️ Project Structure

```
secret-news-chat/
├── public/
│   ├── icons/               # PWA icons
│   ├── manifest.json        # App manifest
│   └── sw.js                # Service worker
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Chat/
│   │   ├── Layout/
│   │   └── NewsFeed/
│   ├── config/
│   │   └── firebase.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── data/
│   │   └── news.json
│   ├── hooks/
│   │   ├── useInactivityTimer.ts
│   │   └── useVisibilityChange.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── chat.service.ts
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── firestore.rules
├── SETUP.md
└── README.md
```

---

## 🧪 Testing Checklist

* Authentication flow
* News feed rendering
* Normal vs secret search behavior
* Real-time chat updates
* Message hiding logic
* Auto-lock (inactivity, blur, background)
* Back navigation handling
* PWA installation
* Offline news availability

---

## 🎨 Customization

### Branding

* `public/manifest.json`
* `index.html` (title/meta)
* Replace icons in `public/icons/`

### Inactivity Timeout

```ts
useInactivityTimer({
  timeout: 60000, // milliseconds
  onInactive: handleInactive,
});
```

---

## 📄 License

Provided **as-is** for educational and demonstration purposes.

---

## ⚖️ Legal Disclaimer

This application is **not intended** for:

* Illegal activities
* Policy circumvention
* Secure or private communication

Users are solely responsible for compliance with applicable laws.

---

## 🤝 Contribution

This is a standalone learning project.
Fork, modify, and experiment freely.

---

**Built with React, TypeScript, Firebase, and Tailwind CSS**

---


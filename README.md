# Secret News Chat

A Progressive Web App (PWA) that appears as a normal news reader but contains a hidden private chat room accessible only via a secret keyword search.

## 🎯 Overview

**Secret News Chat** is a stealth communication app disguised as a news aggregator. The app always opens to a functional news feed, and only users who know the secret keyword can unlock the hidden chat feature by typing it into the search bar.

### Key Features

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

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

### Backend
- **Firebase Authentication** (Email/Password)
- **Cloud Firestore** (Real-time database with offline support)

### PWA
- **Vite PWA Plugin** with Workbox
- Service Worker for offline caching
- Web App Manifest

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier works)
- Modern web browser

## 🚀 Quick Start

### 1. Clone and Install

\`\`\`bash
cd secret-news-chat
npm install
\`\`\`

### 2. Firebase Setup

Follow the detailed instructions in [`SETUP.md`](./SETUP.md) to:
- Create a Firebase project
- Enable Email/Password authentication
- Create a Firestore database
- Configure environment variables

### 3. Configure Environment

Copy the example environment file and add your Firebase credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your Firebase project details.

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:5173`

### 5. Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🔑 Usage

### For End Users

1. **Login**: Sign up or sign in with email and password
2. **Browse News**: The app opens to a news feed (static headlines)
3. **Unlock Chat**: Type the secret keyword into the search bar
4. **Chat**: Send messages in real-time with other allowed users
5. **Security**: Chat auto-locks when you switch apps or wait 60 seconds

### Default Secret Keyword

\`\`\`
quantum2026
\`\`\`

*(Can be changed in `.env.local`)*

### Hiding Messages

- **Long-press** (mobile) or **right-click** (desktop) on any message
- Select "Hide for me"
- Message disappears only for you (others still see it)

## 🔐 Security Features

### Auto-Lock Mechanism

The chat automatically returns to the news feed when:

1. **App Goes to Background**: Switching apps or minimizing browser
2. **Tab Loses Focus**: Switching to another browser tab
3. **Inactivity**: No interaction for 60 seconds
4. **Back Button**: Pressing back from chat screen

### Access Control

- Only authenticated users can access the app
- Optional: Maintain an allowed UID list in Firestore (`/config/allowedUsers`)
- Firestore security rules enforce read/write permissions

### Privacy Considerations

⚠️ **Important Disclaimers**:

- This is a **demonstration/educational project**
- Not suitable for actual sensitive communications
- Messages are stored in Firebase Firestore (not end-to-end encrypted)
- Firebase project admins can access all data
- Use responsibly and within legal boundaries

## 📁 Project Structure

\`\`\`
secret-news-chat/
├── public/
│   ├── icons/              # PWA app icons
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
├── src/
│   ├── components/
│   │   ├── Auth/          # Login/signup components
│   │   ├── Chat/          # Chat room and message components
│   │   ├── Layout/        # App layout with auto-lock
│   │   └── NewsFeed/      # News feed and search bar
│   ├── config/
│   │   └── firebase.ts    # Firebase configuration
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── data/
│   │   └── news.json      # Static news data
│   ├── hooks/
│   │   ├── useInactivityTimer.ts
│   │   └── useVisibilityChange.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── chat.service.ts
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── utils/
│   │   ├── date.ts        # Date formatting
│   │   └── pwa.ts         # PWA utilities
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── firestore.rules        # Firestore security rules
├── SETUP.md              # Detailed setup instructions
└── README.md             # This file
\`\`\`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Authentication (signup, login, logout)
- [ ] News feed displays correctly
- [ ] Search with normal keywords shows results
- [ ] Secret keyword unlocks chat (no visual hints)
- [ ] Real-time message updates
- [ ] Message hiding works correctly
- [ ] Auto-lock on background (60s timeout)
- [ ] Auto-lock on tab blur/visibility change
- [ ] Back button returns to news feed
- [ ] PWA install to home screen
- [ ] Offline functionality (cached news)

## 🔧 Customization

### Change Secret Keyword

Edit `.env.local`:

\`\`\`env
VITE_SECRET_KEYWORD=your_custom_keyword
\`\`\`

### Change App Name/Branding

1. Edit `public/manifest.json`
2. Edit `index.html` (title and meta tags)
3. Replace icons in `public/icons/`

### Adjust Inactivity Timeout

Edit `src/components/Layout/AppLayout.tsx`:

\`\`\`typescript
useInactivityTimer({
  timeout: 60000, // Change this (milliseconds)
  onInactive: handleInactive,
});
\`\`\`

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## ⚠️ Legal Disclaimer

This application is intended for:
- Educational purposes
- Technical demonstration
- Portfolio projects
- Academic review

**NOT intended for**:
- Illegal activities
- Circumventing organizational policies
- Actual sensitive communications requiring encryption

Users are responsible for complying with local laws and regulations.

## 🤝 Contributing

This is a standalone educational project. Feel free to fork and modify for your own learning purposes.

## 📞 Support

For setup issues, refer to [`SETUP.md`](./SETUP.md) for detailed instructions.

---

**Built with React, TypeScript, Firebase, and Tailwind CSS**

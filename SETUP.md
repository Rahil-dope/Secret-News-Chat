# Developer Setup Guide

Complete step-by-step instructions for setting up and running the Secret News Chat PWA.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Installation](#project-installation)
3. [Firebase Project Setup](#firebase-project-setup)
4. [Firestore Configuration](#firestore-configuration)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [Building for Production](#building-for-production)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** (optional, for version control)

### Required Accounts

- **Firebase Account** (free tier is sufficient)
  - Sign up at [firebase.google.com](https://firebase.google.com/)

### Verify Installation

\`\`\`bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
\`\`\`

---

## Project Installation

### 1. Navigate to Project Directory

\`\`\`bash
cd "d:/Coding/WORKKK/secure talk/secret-news-chat"
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

This will install:
- React and React Router
- Firebase SDK
- Tailwind CSS
- Vite and plugins
- TypeScript and types

**Expected output**: ~610 packages installed

---

## Firebase Project Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"** or **"Create a project"**
3. Enter project name: `secret-news-chat` (or your choice)
4. Disable Google Analytics (optional for this project)
5. Click **"Create Project"**

### Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. Register app name: `Secret News Chat`
3. **Do NOT** check "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**
5. **Copy the Firebase configuration object** (you'll need this later)

Example config:
\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
\`\`\`

### Step 3: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get Started"**
3. Click **"Email/Password"** under Sign-in method
4. **Enable** the first option (Email/Password)
5. Leave "Email link (passwordless sign-in)" disabled
6. Click **"Save"**

### Step 4: Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add custom rules)
4. Select your preferred location (closest to your users)
5. Click **"Enable"**

---

## Firestore Configuration

### Step 1: Deploy Security Rules

1. In Firestore Console, go to **Rules** tab
2. Replace the default rules with the contents of `firestore.rules`:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAllowedUser() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/config/allowedUsers) &&
             request.auth.uid in get(/databases/$(database)/documents/config/allowedUsers).data.uids;
    }
    
    match /config/{document} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
    
    match /messages/{messageId} {
      allow read: if isAllowedUser();
      allow create: if isAllowedUser() &&
                      request.auth.uid == request.resource.data.senderUID &&
                      request.resource.data.keys().hasAll(['text', 'senderUID', 'timestamp', 'hiddenFor']) &&
                      request.resource.data.hiddenFor is list;
      allow update: if isAllowedUser() &&
                      request.auth.uid in request.resource.data.hiddenFor &&
                      !(request.auth.uid in resource.data.hiddenFor) &&
                      request.resource.data.diff(resource.data).affectedKeys().hasOnly(['hiddenFor']);
      allow delete: if false;
    }
  }
}
\`\`\`

3. Click **"Publish"**

### Step 2: Create Allowed Users List (Optional)

To restrict chat access to specific users:

1. Go to **Firestore Database > Data** tab
2. Click **"Start collection"**
3. Collection ID: `config`
4. Document ID: `allowedUsers`
5. Add field:
   - **Field**: `uids`
   - **Type**: `array`
   - **Value**: (leave empty for now)
6. Click **"Save"**

**Adding allowed UIDs later**:
1. Create user accounts via the app
2. Find their UIDs in **Authentication > Users** tab
3. Add UIDs to the `uids` array in Firestore

> **Note**: If the `config/allowedUsers` document doesn't exist, the app allows all authenticated users by default (for development).

---

## Environment Variables

### Step 1: Create Environment File

\`\`\`bash
cp .env.example .env.local
\`\`\`

### Step 2: Configure Firebase Credentials

Open `.env.local` and replace with your Firebase config values:

\`\`\`env
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Secret keyword to unlock chat
VITE_SECRET_KEYWORD=quantum2026
\`\`\`

### Step 3: Customize Secret Keyword (Optional)

Change `VITE_SECRET_KEYWORD` to your desired keyword:
- Case-sensitive
- No spaces recommended
- Should not be easily guessable

---

## Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

- Opens at: `http://localhost:5173`
- Hot reload enabled
- Source maps for debugging

### First Run

1. **Sign Up**: Create a new account with email/password
2. **Find Your UID**:
   - Go to Firebase Console > Authentication > Users
   - Copy your user UID
3. **Add to Allowed List** (if configured):
   - Firestore > `config/allowedUsers`
   - Add your UID to the `uids` array
4. **Test Chat**:
   - Type the secret keyword in search bar
   - Should navigate to chat screen

---

## Building for Production

### Step 1: Type Check

\`\`\`bash
npm run build
\`\`\`

This will:
- Run TypeScript compiler (`tsc -b`)
- Build with Vite
- Generate PWA service worker
- Output to `dist/` folder

### Step 2: Preview Build

\`\`\`bash
npm run preview
\`\`\`

- Serves production build locally
- Test PWA features
- Verify offline functionality

### Step 3: Check Build Output

\`\`\`
dist/
├── assets/           # JS and CSS bundles
├── icons/           # PWA icons
├── manifest.json    # PWA manifest
├── sw.js           # Service worker
└── index.html      # Entry point
\`\`\`

---

## Deployment

### Option 1: Firebase Hosting

\`\`\`bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize hosting
firebase init hosting

# Select options:
# - Use existing project
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Deploy
npm run build
firebase deploy --only hosting
\`\`\`

### Option 2: Vercel

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run build
vercel --prod
\`\`\`

### Option 3: Netlify

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables in Production

Remember to set all `VITE_*` environment variables in your hosting platform's environment config.

---

## Troubleshooting

### Issue: "Firebase not defined"

**Cause**: Environment variables not loaded

**Solution**:
1. Ensure `.env.local` exists with correct values
2. Restart dev server after changing env variables
3. Check that variable names start with `VITE_`

### Issue: "Permission denied" in Firestore

**Cause**: Security rules blocking access or user not in allowed list

**Solution**:
1. Verify security rules are deployed
2. Check user UID is in `config/allowedUsers.uids` array
3. Ensure user is authenticated (check Firebase Auth console)

### Issue: Chat doesn't unlock with keyword

**Cause**: Keyword mismatch or typo

**Solution**:
1. Check `.env.local` for exact keyword (case-sensitive)
2. Restart dev server after changing keyword
3. Clear browser cache
4. Type keyword exactly as specified

### Issue: "Module not found" errors

**Cause**: Dependencies not installed

**Solution**:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: PWA not installing

**Cause**: HTTPS required for PWA (except localhost)

**Solution**:
- Localhost works without HTTPS
- Production requires valid SSL certificate
- Use Firebase Hosting, Vercel, or Netlify (auto-SSL)

### Issue: Service Worker not updating

**Cause**: Browser cache

**Solution**:
1. Clear browser cache
2. Unregister service worker in DevTools
3. Hard refresh (Ctrl+Shift+R)

### Issue: Build fails with TypeScript errors

**Cause**: Type checking errors

**Solution**:
\`\`\`bash
# Check errors
npm run build

# Fix type errors in reported files
# Or temporarily bypass (not recommended):
npx vite build --mode production
\`\`\`

---

## Development Tips

### Hot Reload Issues

If changes don't reflect:
1. Save the file
2. Check terminal for build errors
3. Hard refresh browser

### Debugging Firestore Rules

1. Go to Firestore > Rules playground
2. Simulate operations with test user UIDs
3. Check which rules are failing

### Testing Auto-Lock Features

- **Inactivity**: Wait 60 seconds in chat
- **Background**: Switch browser tabs
- **Back button**: Use browser back
- Check console for navigation events

### Viewing Service Worker

1. Open DevTools
2. Go to Application > Service Workers
3. Check registration status
4. Use "Update on reload" for development

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

---

## Getting Help

### Check These First

1. Browser console for errors
2. Firebase Console > Authentication (user authentication)
3. Firebase Console > Firestore (data and rules)
4. Network tab for API errors
5. Service Worker status in DevTools

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `auth/user-not-found` | Email doesn't exist | Sign up first |
| `auth/wrong-password` | Incorrect password | Check password |
| `permission-denied` | Firestore rules | Add UID to allowed list |
| `network-request-failed` | Firebase config wrong | Check `.env.local` |

---

**Setup complete! 🎉**

Run `npm run dev` and start testing the app.

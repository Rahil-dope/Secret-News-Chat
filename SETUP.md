# 🛠️ Developer Setup Guide

**Secret News Chat – Progressive Web App**

This document provides **end-to-end instructions** to configure, run, and deploy the **Secret News Chat** PWA in a local or production environment.

---

## 📑 Table of Contents

1. [System Requirements](#system-requirements)
2. [Local Installation](#local-installation)
3. [Firebase Project Setup](#firebase-project-setup)
4. [Firestore Security Configuration](#firestore-security-configuration)
5. [Environment Configuration](#environment-configuration)
6. [Running the Application](#running-the-application)
7. [Production Build](#production-build)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Development Notes](#development-notes)
11. [References](#references)

---

## ✅ System Requirements

### Required Software

* **Node.js** ≥ 18.x
* **npm** ≥ 9.x
* **Git** (optional but recommended)

Verify installation:

```bash
node --version
npm --version
```

---

### Required Accounts

* **Firebase Account**
  Sign up: [https://firebase.google.com/](https://firebase.google.com/)

Free tier is sufficient for development and testing.

---

## 📦 Local Installation

### 1. Navigate to Project Directory

```bash
cd secret-news-chat
```

> Avoid spaces or special characters in the project path.

---

### 2. Install Dependencies

```bash
npm install
```

Installs:

* React + Router
* Firebase SDK
* Tailwind CSS
* Vite + PWA plugins
* TypeScript tooling

Expected install size: ~600 packages.

---

## 🔥 Firebase Project Setup

### Step 1: Create a Firebase Project

1. Open **Firebase Console**
2. Click **Create Project**
3. Name: `secret-news-chat` (or custom)
4. Disable Google Analytics (recommended)
5. Create project

---

### Step 2: Register Web Application

1. Inside Firebase project → click **Web (`</>`)**
2. App name: `Secret News Chat`
3. **Do not enable Firebase Hosting yet**
4. Register app
5. Copy the generated Firebase config

Example:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "project.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcdef"
};
```

---

### Step 3: Enable Authentication

1. Firebase Console → **Build → Authentication**
2. Click **Get Started**
3. Enable **Email / Password**
4. Disable passwordless login
5. Save

---

### Step 4: Create Firestore Database

1. Firebase Console → **Build → Firestore**
2. Create database
3. Select **Production mode**
4. Choose closest region
5. Enable

---

## 🔐 Firestore Security Configuration

### Step 1: Deploy Firestore Rules

Go to **Firestore → Rules** and replace with:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAllowedUser() {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/config/allowedUsers) &&
        request.auth.uid in
        get(/databases/$(database)/documents/config/allowedUsers).data.uids;
    }

    match /config/{doc} {
      allow read: if isAuthenticated();
      allow write: if false;
    }

    match /messages/{messageId} {
      allow read: if isAllowedUser();

      allow create: if isAllowedUser() &&
        request.auth.uid == request.resource.data.senderUID &&
        request.resource.data.keys()
          .hasAll(['text', 'senderUID', 'timestamp', 'hiddenFor']) &&
        request.resource.data.hiddenFor is list;

      allow update: if isAllowedUser() &&
        request.auth.uid in request.resource.data.hiddenFor &&
        !(request.auth.uid in resource.data.hiddenFor) &&
        request.resource.data.diff(resource.data)
          .affectedKeys().hasOnly(['hiddenFor']);

      allow delete: if false;
    }
  }
}
```

Click **Publish**.

---

### Step 2: (Optional) Restrict Chat Access

Create allowlist document:

1. Firestore → Data
2. Collection: `config`
3. Document: `allowedUsers`
4. Field:

   * `uids` → Array

Add user UIDs manually from **Authentication → Users**.

> If this document does not exist, all authenticated users are allowed (development default).

---

## 🌱 Environment Configuration

### Step 1: Create Local Environment File

```bash
cp .env.example .env.local
```

---

### Step 2: Configure Firebase Credentials

Edit `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abcdef

# Secret keyword to unlock chat
VITE_SECRET_KEYWORD=quantum2026
```

---

### Step 3: Secret Keyword Rules

* Case-sensitive
* No spaces recommended
* Should not resemble normal search terms

Restart dev server after changes.

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

* URL: `http://localhost:5173`
* Hot reload enabled
* Debug-friendly source maps

---

### First-Time Validation Checklist

1. Sign up via UI
2. Copy UID from Firebase Authentication
3. Add UID to `config/allowedUsers` (if enabled)
4. Type secret keyword in search bar
5. Verify chat unlocks

---

## 🏗️ Production Build

### Build

```bash
npm run build
```

Actions performed:

* TypeScript type checking
* Optimized Vite build
* PWA service worker generation

---

### Preview Build

```bash
npm run preview
```

Use this to:

* Test PWA installation
* Verify offline caching
* Validate production behavior

---

### Build Output

```
dist/
├── assets/
├── icons/
├── manifest.json
├── sw.js
└── index.html
```

---

## 🚀 Deployment (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

**Recommended options:**

* Existing project
* Public directory: `dist`
* Single-page app: **Yes**
* Auto builds: **No**

Deploy:

```bash
npm run build
firebase deploy --only hosting
```

---

### Production Environment Variables

Ensure all `VITE_*` variables are configured in the hosting environment.

---

## 🧯 Troubleshooting

### Firebase Not Initialized

**Cause**: Missing or invalid env variables
**Fix**:

* Verify `.env.local`
* Restart dev server
* Ensure `VITE_` prefix

---

### Firestore Permission Denied

**Cause**: UID not allowed or rules misconfigured
**Fix**:

* Check Firestore rules
* Confirm UID in `allowedUsers`
* Ensure user is authenticated

---

### Chat Not Unlocking

**Cause**: Keyword mismatch
**Fix**:

* Check case sensitivity
* Restart server
* Clear cache

---

### Dependency Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### PWA Not Installing

**Cause**: HTTPS required
**Fix**:

* Use localhost for dev
* Use Firebase / Vercel / Netlify for prod

---

## 🧠 Development Notes

* Use Firestore Rules Playground for rule debugging
* Monitor Service Worker in DevTools → Application
* Test auto-lock by:

  * Tab switching
  * Backgrounding
  * Idle timeout
  * Back navigation

---

## 📚 References

* Firebase Docs: [https://firebase.google.com/docs](https://firebase.google.com/docs)
* Vite: [https://vitejs.dev/](https://vitejs.dev/)
* React Router: [https://reactrouter.com/](https://reactrouter.com/)
* Tailwind CSS: [https://tailwindcss.com/](https://tailwindcss.com/)
* PWA Guide: [https://web.dev/progressive-web-apps/](https://web.dev/progressive-web-apps/)

---

## ✅ Setup Complete

Run:

```bash
npm run dev
```

You’re ready to test and iterate.

---

# Fans Support Guide (Boilerplate)

An **Offline-First Progressive Web App (PWA)** designed to provide logistics and safety information for fans at major sporting events.

Built with a **€0 budget stack**, this project serves as a template for organizers, fan groups, or developers who need to deploy a resilient informational tool in high-congestion environments (like stadiums).

## 🚀 Features

- **Offline-First**: Service Workers cache assets and data for reliable performance without internet.
- **Maps**: Interactive maps using Leaflet.js and OpenStreetMap.
- **CMS via Google Sheets**: Manage POIs, match schedules, and timelines directly from a spreadsheet—no database setup required.
- **Push Notifications**: Integrated with Firebase Cloud Messaging (FCM).
- **Lightweight**: Optimized for fast loading on mobile devices.

## 🛠️ Tech Stack

- **Frontend**: [Astro](https://astro.build/) (Static Site Generation)
- **Maps**: [Leaflet.js](https://leafletjs.com/)
- **Backend**: Google Sheets (CSV Export)
- **Notifications**: [Firebase](https://firebase.google.com/)
- **Deployment**: [Netlify](https://www.netlify.com/) (Free Tier)

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Google Account (for Google Sheets)
- A Firebase Project (for notifications)

### 2. Installation
`ash
git clone <your-repo-url>
cd fans-support-guide
npm install
`

### 3. Configuration

#### Google Sheets (CMS)
1. Create a Google Sheet with three tabs: `POIs`, `Matches`, and `Timeline`.
2. Follow the column structure found in `src/services/match-service.ts`.
3. Publish to the Web as **CSV**.
4. Copy the CSV URLs and paste them into `src/services/match-service.ts`.

#### Firebase
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Add a Web App and copy the `firebaseConfig` object.
3. Paste the config into `src/services/firebase-config.ts`.
4. Enable Cloud Messaging and generate a Web Push (VAPID) key.

### 4. Development
`ash
npm run dev
`

### 5. Deployment
Push your code to GitHub and connect it to **Netlify**. Ensure you configure the build command as `npm run build` and the publish directory as `dist`.

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🤖 AI-Ready
This project includes an `AGENT.md` file with architectural rules, making it optimized for development with AI assistants like Gemini, ChatGPT, or Claude.

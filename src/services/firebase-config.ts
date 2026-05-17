/**
 * Firebase Configuration - Fans Support Guide (Open Source Boilerplate)
 * Replace these values with your own Firebase Project configuration.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

/**
 * Public VAPID Key for Push Notifications
 * Generate this in Firebase Console -> Project Settings -> Cloud Messaging -> Web Configuration
 */
export const VAPID_KEY = import.meta.env.FIREBASE_VAPID_KEY || "YOUR_VAPID_KEY";

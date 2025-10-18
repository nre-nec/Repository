// This file configures and initializes Firebase.
// The Firebase SDKs are loaded via <script> tags in index.html, which
// makes the `firebase` global object available.

// This declaration tells TypeScript that a global `firebase` object exists.
declare const firebase: any;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjP-6Zink7dv-qf8XXlJMAxEEjZvK60LE",
  authDomain: "evaluation-system-9d456.firebaseapp.com",
  projectId: "evaluation-system-9d456",
  storageBucket: "evaluation-system-9d456.firebasestorage.app",
  messagingSenderId: "356185568621",
  appId: "1:356185568621:web:2e68b58351305559e5d664"
};

// Initialize Firebase, but only if it hasn't been initialized already.
// This prevents errors on hot reloads.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the firestore database instance for use in other files.
export const db = firebase.firestore();

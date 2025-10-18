// This declaration informs TypeScript that 'firebase' is a global variable
// provided by the scripts loaded in index.html
declare const firebase: any;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjP-6Zink7dv-qf8XXlJMAxEEjZvK60LE",
  authDomain: "evaluation-system-9d456.firebaseapp.com",
  projectId: "evaluation-system-9d456",
  storageBucket: "evaluation-system-9d456.appspot.com",
  messagingSenderId: "356185568621",
  appId: "1:356185568621:web:2e68b58351305559e5d664"
};

// Initialize Firebase App if it's not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get and export the Firestore database instance
export const db = firebase.firestore();

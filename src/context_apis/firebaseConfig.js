import { initializeApp, getApp, getApps } from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging"; // Import correctly

const firebaseConfig = {
  apiKey: "AIzaSyCjmX5yMzRcDMr9kHctj6xDHYkywbHp-dQ",
  authDomain: "food-95b67.firebaseapp.com",
  projectId: "food-95b67",
  storageBucket: "food-95b67.appspot.com", // Fix incorrect URL
  messagingSenderId: "969747988387",
  appId: "1:969747988387:android:765edd008a6818960ea416",
  databaseURL: "" // Add this line
};

// Ensure Firebase is only initialized once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp(); 
console.log("Firebase initialized:", app);

export { app, messaging };

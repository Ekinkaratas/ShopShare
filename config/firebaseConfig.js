import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4xD-cg5Dn7z6Mit6Q975UrYAaY7nivt8",
  authDomain: "shopping-list-and-sharing-app.firebaseapp.com",
  projectId: "shopping-list-and-sharing-app",
  storageBucket: "shopping-list-and-sharing-app.firebasestorage.app",
  messagingSenderId: "592294368986",
  appId: "1:592294368986:web:d5bad279cb1ba5228437e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app)

export { app, auth, };
export default app;
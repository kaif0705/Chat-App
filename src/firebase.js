import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAmDbZ3smwRzLsaCaSETmsWK8N4howajBE",
  authDomain: "chatapp-282a1.firebaseapp.com",
  projectId: "chatapp-282a1",
  storageBucket: "chatapp-282a1.appspot.com",
  messagingSenderId: "1056082719632",
  appId: "1:1056082719632:web:8209059b7362f216877915",
  measurementId: "G-5RNQ4BL51X"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
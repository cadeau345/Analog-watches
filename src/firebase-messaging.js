import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC6Na61pWwy1EthcAM2rDc_WtwaewFGLGQ",
  authDomain: "analog-watches-380b5.firebaseapp.com",
  projectId: "analog-watches-380b5",
  storageBucket: "analog-watches-380b5.firebasestorage.app",
  messagingSenderId: "401445353537",
  appId: "1:401445353537:web:bf4ff092d718093026eec0"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey:
        "BEhy0N0GVeO4MsOe6mFh9d9MVa4HIZJR65w1rXJc4Jp9mbBwJytUE6h31V6_Cf1SEaBzmFfeZd0QdA02FjZR3Xg",
    });

    if (token) {
      console.log("FCM Token:", token);
    } else {
      console.log("No registration token available");
    }

  } catch (error) {
    console.error("Error getting notification permission", error);
  }
};
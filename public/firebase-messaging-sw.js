importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC6Na61pWwy1EthcAM2rDc_WtwaewFGLGQ",
  authDomain: "analog-watches-380b5.firebaseapp.com",
  projectId: "analog-watches-380b5",
  messagingSenderId: "401445353537",
  appId: "1:401445353537:web:bf4ff092d718093026eec0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png"
  });

});
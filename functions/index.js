const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.newOrderNotification = functions.firestore
.document("orders/{orderId}")
.onCreate(async (snap, context) => {

  const order = snap.data();

  const payload = {
    notification: {
      title: "🛒 New Order",
      body: `New order from ${order.name}`,
      sound: "default"
    }
  };

  const tokens = [];

  const snapshot = await admin.firestore().collection("adminTokens").get();

  snapshot.forEach(doc => {
    tokens.push(doc.data().token);
  });

  if (tokens.length > 0) {
    await admin.messaging().sendToDevice(tokens, payload);
  }

});
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.authTrigger = functions.auth.user().onCreate(async user => {
  const { uid, displayName, email, photoURL } = user;

  const newUser = {
    uid,
    displayName,
    email,
    photoURL,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const userRef = admin
    .firestore()
    .collection("users")
    .doc(user.uid);
  await userRef.set(newUser, { merge: true });
});

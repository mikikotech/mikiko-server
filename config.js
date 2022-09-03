var firebase = require("firebase");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyAMMrTWIU5gKeCDKwiLwO-7liVvfpT8u-M",
  authDomain: "mikiko-c5ca4.firebaseapp.com",
  databaseURL: "https://mikiko-c5ca4-default-rtdb.firebaseio.com",
  projectId: "mikiko-c5ca4",
  storageBucket: "mikiko-c5ca4.appspot.com",
  messagingSenderId: "774801735464",
  appId: "1:774801735464:web:e5499e3c4d19306cd51a1d",
  measurementId: "G-CDHBDR4Y55",
};

// Initialize Firebase
var fire = firebase.initializeApp(config);
module.exports = fire;

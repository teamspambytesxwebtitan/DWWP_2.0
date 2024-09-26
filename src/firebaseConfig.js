// // src/firebaseConfig.js

// import { initializeApp } from 'firebase/app';
// import { getAuth } from "firebase/auth"; // Import Firebase Authentication
// import { getFirestore } from 'firebase/firestore';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCaQ4-CXMn-2HB0RdMKZvDmVm6SGtXPnk8",
//   authDomain: "waterflow-dashboard.firebaseapp.com",
//   projectId: "waterflow-dashboard",
//   storageBucket: "waterflow-dashboard.appspot.com",
//   messagingSenderId: "63673543015",
//   appId: "1:63673543015:web:94eb493ecc8adfa41f1391"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// const db = getFirestore(app);

// export { db };


// src/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaQ4-CXMn-2HB0RdMKZvDmVm6SGtXPnk8",
  authDomain: "waterflow-dashboard.firebaseapp.com",
  projectId: "waterflow-dashboard",
  storageBucket: "waterflow-dashboard.appspot.com",
  messagingSenderId: "63673543015",
  appId: "1:63673543015:web:94eb493ecc8adfa41f1391"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app); // Initialize auth
const db = getFirestore(app);

export { auth, db };

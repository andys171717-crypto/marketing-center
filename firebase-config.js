// Firebase Config - Marketing Center

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_Nrh-1VsGLlbyIMmt8POjpc1w7RB1U6s",
    authDomain: "marketing-center-94f6f.firebaseapp.com",
    projectId: "marketing-center-94f6f",
    storageBucket: "marketing-center-94f6f.firebasestorage.app",
    messagingSenderId: "202926336637",
    appId: "1:202926336637:web:84fcec7fccaf1a1fc95f14"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export {

    app,

    db,

    auth,

    googleProvider

};

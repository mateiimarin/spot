import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

export default defineNuxtPlugin(async nuxtApp => {

    const config = useRuntimeConfig()

    const firebaseConfig = {
        apiKey: "AIzaSyA49xxLBP5KmrxeY5JocpLkQUNTobKhek0",
        authDomain: "spot-3a827.firebaseapp.com",
        projectId: "spot-3a827",
        storageBucket: "spot-3a827.appspot.com",
        messagingSenderId: "160288900038",
        appId: "1:160288900038:web:021fd248f4ccb6fe4168c7",
        measurementId: "G-QFG59DT7B1"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app)
    //const storage = getStorage(app);
    const analytics = getAnalytics(app);

    nuxtApp.vueApp.provide('auth', auth);
    nuxtApp.provide('auth', auth);

    nuxtApp.vueApp.provide('db', db);
    nuxtApp.provide('db', db);

    await initUser();

  })
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
    apiKey: "AIzaSyBibUO_TCz6UUUy8Bl2apXrAPVw9QLhhgU",
    authDomain: "connectm-7df5c.firebaseapp.com",
    databaseURL: "https://connectm-7df5c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "connectm-7df5c",
    storageBucket: "connectm-7df5c.appspot.com",
    messagingSenderId: "311999934236",
    appId: "1:311999934236:web:a42b14042e8386b05a94d9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export default db
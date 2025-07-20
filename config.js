// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyByHiJnziqntKdg9ErMxLORJ_1nRAktOj4",
    authDomain: "fislab12.firebaseapp.com",
    databaseURL: "https://fislab12-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fislab12",
    storageBucket: "fislab12.appspot.com",
    messagingSenderId: "92616259041",
    appId: "1:92616259041:web:eb6646e4a539d46b980ea0",
    measurementId: "G-EBKR0E6F88"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
    
    // Periksa koneksi database
    firebase.database().ref('.info/connected').on('value', function(snap) {
        if (snap.val() === true) {
            console.log("✅ Terhubung ke Firebase Database");
        } else {
            console.error("❌ Terputus dari Firebase Database");
        }
    });
} else {
    console.error("Firebase SDK not loaded");
}

// Definisikan variabel global
const database = firebase.database();
const auth = firebase.auth();

// Initial sample data
let defaultCandidates = [
    { 
        nrp: "5001232001", 
        password: "hidupjokowi", 
        status: "lulus", 
        name: "Ahmad Fauzi",
        code: "A1"
    },
    { 
        nrp: "5001232002", 
        password: "hidupjokowi", 
        status: "tidak", 
        name: "Budi Santoso",
        code: "A2"
    },
    { 
        nrp: "5001232003", 
        password: "hidupjokowi", 
        status: "lulus", 
        name: "Siti Nurhaliza",
        code: "A3"
    }
];

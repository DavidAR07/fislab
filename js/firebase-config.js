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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const database = firebase.database();
const auth = firebase.auth();

// Check database connection
database.ref('.info/connected').on('value', function(snap) {
    if (snap.val() === true) {
        console.log("✅ Terhubung ke Firebase Database");
    } else {
        console.error("❌ Terputus dari Firebase Database");
    }
});

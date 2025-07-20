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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Check connection
const checkConnection = () => {
    const connectedRef = database.ref('.info/connected');
    connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
            console.log("✅ Connected to Firebase Database");
        } else {
            console.log("❌ Disconnected from Firebase Database");
            // Try to reconnect
            setTimeout(checkConnection, 2000);
        }
    });
};

checkConnection();

// Export with error handling
try {
    if (!app || !database || !auth) {
        throw new Error("Firebase initialization failed");
    }
    console.log("Firebase initialized successfully");
} catch (error) {
    console.error("Firebase initialization error:", error);
    alert("Error initializing Firebase. Please check console.");
}

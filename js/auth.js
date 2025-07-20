// Fungsi untuk inisialisasi auth state listener
function initAuthStateListener() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("Admin sudah login:", user.email);
            document.getElementById('adminDashboard').classList.remove('hidden');
            loadCandidates();
        } else {
            console.log("Admin belum login");
            document.getElementById('adminDashboard').classList.add('hidden');
        }
    });
}

// Fungsi untuk login admin
function loginAdmin(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            // Hide login modal
            document.getElementById('adminLoginModal').classList.add('hidden');
            
            // Show admin dashboard
            document.getElementById('adminDashboard').classList.remove('hidden');
            
            // Load candidates
            loadCandidates();
            
            return { success: true };
        })
        .catch(error => {
            // Tampilkan modal "Hayoo"
            document.getElementById('adminLoginModal').classList.add('hidden');
            document.getElementById('hayooModal').classList.remove('hidden');
            
            // Tambahkan efek shake
            const hayooModal = document.querySelector('#hayooModal .shake-animation');
            hayooModal.classList.remove('shake-animation');
            setTimeout(() => {
                hayooModal.classList.add('shake-animation');
            }, 10);
            
            return { success: false, error };
        });
}

// Fungsi untuk logout admin
function logoutAdmin() {
    return auth.signOut()
        .then(() => {
            document.getElementById('adminDashboard').classList.add('hidden');
        });
}

// Export fungsi yang diperlukan
window.authFunctions = {
    initAuthStateListener,
    loginAdmin,
    logoutAdmin
};

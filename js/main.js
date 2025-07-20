// Inisialisasi aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    console.log("Aplikasi dimulai...");
    
    // Inisialisasi data Firebase
    initializeData().catch(error => {
        console.error("Gagal menginisialisasi data:", error);
    });
    
    // Inisialisasi auth state listener
    initAuthStateListener();
    
    // Event listener untuk form periksa kelulusan
    document.getElementById('checkForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nrp = document.getElementById('nrp').value;
        const password = document.getElementById('password').value;
        
        checkCandidate(nrp, password)
            .then(({ found, candidate }) => {
                showResultModal(found, candidate);
            })
            .catch(error => {
                console.error("Error:", error);
                showResultModal(false, null);
            });
    });
    
    // Event listener untuk toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', togglePasswordVisibility);
    
    // Event listener untuk tombol admin
    document.getElementById('adminButton').addEventListener('click', function() {
        document.getElementById('adminLoginModal').classList.remove('hidden');
    });
    
    // Event listener untuk form login admin
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        loginAdmin(email, password)
            .catch(error => {
                console.error("Login error:", error);
            });
    });
    
    // Inisialisasi admin dashboard
    initAdminDashboard();
    
    console.log("Aplikasi siap!");
});

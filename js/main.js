// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplikasi dimulai...");

    // Safe element checking
    const safeGetElement = (id) => {
        const el = document.getElementById(id);
        if (!el) console.error(`Element with ID ${id} not found`);
        return el;
    };

    // Initialize with error handling
    try {
        // Check essential elements exist
        const adminButton = safeGetElement('adminButton');
        const checkForm = safeGetElement('checkForm');
        
        if (!adminButton || !checkForm) {
            throw new Error("Essential elements missing");
        }

        // Initialize Firebase data
        initializeData().catch(error => {
            console.error("Initialize data error:", error);
        });

        // Event listeners with null checks
        adminButton.addEventListener('click', () => {
            const adminLoginModal = safeGetElement('adminLoginModal');
            if (adminLoginModal) {
                adminLoginModal.classList.remove('hidden');
            }
        });

        checkForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nrp = safeGetElement('nrp')?.value;
            const password = safeGetElement('password')?.value;
            
            if (nrp && password) {
                checkCandidate(nrp, password)
                    .then(({ found, candidate }) => {
                        showResultModal(found, candidate);
                    })
                    .catch(error => {
                        console.error("Check candidate error:", error);
                        showResultModal(false, null);
                    });
            }
        });

        // Initialize other components
        initAuthStateListener();
        initAdminDashboard();

        console.log("Aplikasi berhasil diinisialisasi");
    } catch (error) {
        console.error("Initialization error:", error);
        alert("Terjadi error saat memulai aplikasi. Lihat console untuk detail.");
    }
});

// Safe toggle password visibility
const togglePassword = () => {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeSlashIcon = document.getElementById('eyeSlashIcon');
    
    if (passwordInput && eyeIcon && eyeSlashIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeSlashIcon.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeSlashIcon.classList.add('hidden');
        }
    }
};

// Add toggle event if element exists
const togglePasswordBtn = document.getElementById('togglePassword');
if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', togglePassword);
}

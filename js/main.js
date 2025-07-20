document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplikasi dimulai...");

    // Safe element function
    const getElement = (id) => {
        const el = document.getElementById(id);
        if (!el) console.error(`Element with ID ${id} not found`);
        return el;
    };

    try {
        // Initialize Firebase data
        initializeData().catch(console.error);

        // Initialize auth
        initAuthStateListener();

        // Setup main event listeners
        const adminButton = getElement('adminButton');
        const checkForm = getElement('checkForm');
        const togglePasswordBtn = getElement('togglePassword');

        if (adminButton) {
            adminButton.addEventListener('click', () => {
                getElement('adminLoginModal')?.classList.remove('hidden');
            });
        }

        if (checkForm) {
            checkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nrp = getElement('nrp')?.value;
                const password = getElement('password')?.value;
                
                if (nrp && password) {
                    checkCandidate(nrp, password)
                        .then(({ found, candidate }) => {
                            showResultModal(found, candidate);
                        })
                        .catch(console.error);
                }
            });
        }

        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', () => {
                const passwordInput = getElement('password');
                const eyeIcon = getElement('eyeIcon');
                const eyeSlashIcon = getElement('eyeSlashIcon');
                
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
            });
        }

        // Initialize admin dashboard
        initAdminDashboard();

        console.log("Aplikasi berhasil diinisialisasi");
    } catch (error) {
        console.error("Initialization error:", error);
    }
});

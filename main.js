document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Initialize Firebase data
    initializeData();
    
    // Toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const eyeIcon = document.getElementById('eyeIcon');
        const eyeSlashIcon = document.getElementById('eyeSlashIcon');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeSlashIcon.classList.remove('hidden');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeSlashIcon.classList.add('hidden');
        }
    });

    // Form submission
    const checkForm = document.getElementById('checkForm');
    if (checkForm) {
        console.log("Form periksa kelulusan ditemukan");
        checkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form periksa kelulusan disubmit");
            
            const nrp = document.getElementById('nrp').value;
            const password = document.getElementById('password').value;
            console.log("Memeriksa NRP:", nrp);
            
            // Coba akses database langsung
            try {
                console.log("Mengakses database...");
                database.ref('candidates').once('value')
                    .then(snapshot => {
                        console.log("Data diterima:", snapshot.exists());
                        let found = false;
                        let candidate = null;
                        
                        snapshot.forEach(childSnapshot => {
                            const data = childSnapshot.val();
                            console.log("Memeriksa data:", data.nrp);
                            if (data.nrp === nrp && data.password === password) {
                                found = true;
                                candidate = data;
                                console.log("Kandidat ditemukan:", data);
                                return true; // Break the forEach loop
                            }
                        });
                        
                        showResultModal(found, candidate);
                    })
                    .catch(error => {
                        console.error("Error saat mengakses database:", error);
                        alert("Terjadi kesalahan: " + error.message);
                    });
            } catch (error) {
                console.error("Exception:", error);
                alert("Terjadi kesalahan: " + error.message);
            }
        });
    } else {
        console.error("Form periksa kelulusan tidak ditemukan");
    }

    // Close modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('resultModal').classList.add('hidden');
    });
    
    // Close hayoo modal
    document.getElementById('closeHayooModal').addEventListener('click', function() {
        document.getElementById('hayooModal').classList.add('hidden');
    });
    
    // Admin button click
    const adminButton = document.getElementById('adminButton');
    if (adminButton) {
        console.log("Admin button found");
        adminButton.addEventListener('click', function() {
            console.log('Admin button clicked');
            const adminLoginModal = document.getElementById('adminLoginModal');
            if (adminLoginModal) {
                adminLoginModal.classList.remove('hidden');
            } else {
                console.error('Admin login modal not found');
            }
        });
    } else {
        console.error('Admin button not found');
    }
    
    // Cancel admin login
    document.getElementById('cancelAdminLogin').addEventListener('click', function() {
        document.getElementById('adminLoginModal').classList.add('hidden');
    });
});

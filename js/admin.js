function initAdminDashboard() {
    // Safe element function
    const getElement = (id) => {
        const el = document.getElementById(id);
        if (!el) console.error(`Element with ID ${id} not found`);
        return el;
    };

    // Pastikan semua element ada sebelum menambahkan event listener
    const adminLoginForm = getElement('adminLoginForm');
    const addCandidateForm = getElement('addCandidateForm');
    const editCandidateForm = getElement('editCandidateForm');
    const csvFileInput = getElement('csvFileInput');
    const importCsvButton = getElement('importCsvButton');
    const selectAllCheckbox = getElement('selectAllCheckbox');
    const deleteSelectedButton = getElement('deleteSelectedButton');
    const logoutAdminButton = getElement('logoutAdmin');
    const cancelEditButton = getElement('cancelEdit');
    const cancelAdminLoginButton = getElement('cancelAdminLogin');
    const closeHayooModalButton = getElement('closeHayooModal');
    const closeModalButton = getElement('closeModal');

    // Tambahkan event listener hanya jika element ada
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = getElement('adminEmail')?.value;
            const password = getElement('adminPassword')?.value;
            
            if (email && password) {
                loginAdmin(email, password).catch(console.error);
            }
        });
    }

    if (addCandidateForm) {
        addCandidateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newCandidate = {
                nrp: getElement('newNrp')?.value,
                password: getElement('newPassword')?.value,
                name: getElement('newName')?.value,
                code: getElement('newCode')?.value,
                status: getElement('newStatus')?.value
            };
            
            if (newCandidate.nrp && newCandidate.password) {
                addCandidate(newCandidate)
                    .then(() => addCandidateForm.reset())
                    .catch(console.error);
            }
        });
    }

    if (editCandidateForm) {
        editCandidateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const candidateId = getElement('editCandidateId')?.value;
            const updatedCandidate = {
                nrp: getElement('editNrp')?.value,
                password: getElement('editPassword')?.value,
                name: getElement('editName')?.value,
                code: getElement('editCode')?.value,
                status: getElement('editStatus')?.value
            };
            
            if (candidateId) {
                saveCandidate(candidateId, updatedCandidate)
                    .then(() => getElement('editCandidateModal')?.classList.add('hidden'))
                    .catch(console.error);
            }
        });
    }

    // Event listener lainnya dengan null check
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', () => {
            getElement('editCandidateModal')?.classList.add('hidden');
        });
    }

    if (cancelAdminLoginButton) {
        cancelAdminLoginButton.addEventListener('click', () => {
            getElement('adminLoginModal')?.classList.add('hidden');
        });
    }

    if (closeHayooModalButton) {
        closeHayooModalButton.addEventListener('click', () => {
            getElement('hayooModal')?.classList.add('hidden');
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            getElement('resultModal')?.classList.add('hidden');
        });
    }

    if (logoutAdminButton) {
        logoutAdminButton.addEventListener('click', logoutAdmin);
    }

    console.log("Admin dashboard initialized");
}

// Export function
window.initAdminDashboard = initAdminDashboard;

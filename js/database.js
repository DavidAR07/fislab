// Pesan standar berdasarkan status
const standardMessages = {
    lulus: "Selamat! Anda dinyatakan LOLOS sebagai calon Asisten Fisika Laboratorium 1. Silahkan baca dokumen dibawah ini untuk informasi tahap selanjutnya.",
    tidak: "Mohon maaf, Anda dinyatakan TIDAK LOLOS seleksi Asisten Fisika Laboratorium 1. Tetap semangat dan terima kasih atas partisipasinya."
};

// Data kandidat default
const defaultCandidates = [
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

// Fungsi untuk memeriksa kandidat
function checkCandidate(nrp, password) {
    return database.ref('candidates').once('value')
        .then(snapshot => {
            let found = false;
            let candidate = null;
            
            snapshot.forEach(childSnapshot => {
                const data = childSnapshot.val();
                if (data.nrp === nrp && data.password === password) {
                    found = true;
                    candidate = data;
                    return true; // Break the forEach loop
                }
            });
            
            return { found, candidate };
        });
}

// Fungsi untuk memuat daftar kandidat
function loadCandidates() {
    console.log("Memuat daftar kandidat...");
    const candidatesList = document.getElementById('candidatesList');
    
    if (!candidatesList) {
        console.error("Element candidatesList tidak ditemukan");
        return Promise.resolve();
    }
    
    candidatesList.innerHTML = '<tr><td colspan="7" class="py-3 px-4 text-center">Memuat data...</td></tr>';
    
    return database.ref('candidates').once('value')
        .then(snapshot => {
            candidatesList.innerHTML = '';
            
            if (!snapshot.exists()) {
                candidatesList.innerHTML = '<tr><td colspan="7" class="py-3 px-4 text-center">Tidak ada data kandidat</td></tr>';
                return;
            }
            
            // Reset selected count
            updateSelectedCount(0);
            
            snapshot.forEach(childSnapshot => {
                const candidateId = childSnapshot.key;
                const candidate = childSnapshot.val();
                
                const row = document.createElement('tr');
                row.className = candidate.status === 'lulus' ? 'border-b border-gray-700 bg-gray-800' : 'border-b border-gray-700';
                
                row.innerHTML = `
                    <td class="py-3 px-2 text-center">
                        <input type="checkbox" class="candidate-checkbox rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500" data-id="${candidateId}">
                    </td>
                    <td class="py-3 px-4">${candidate.nrp}</td>
                    <td class="py-3 px-4">${candidate.password}</td>
                    <td class="py-3 px-4">${candidate.name || '-'}</td>
                    <td class="py-3 px-4">${candidate.code || '-'}</td>
                    <td class="py-3 px-4">
                        <span class="px-2 py-1 rounded-full text-xs ${candidate.status === 'lulus' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}">
                            ${candidate.status === 'lulus' ? 'Lulus' : 'Tidak Lulus'}
                        </span>
                    </td>
                    <td class="py-3 px-4">
                        <button class="edit-button bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded mr-1" data-id="${candidateId}">
                            Edit
                        </button>
                        <button class="delete-button bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" data-id="${candidateId}">
                            Hapus
                        </button>
                    </td>
                `;
                
                candidatesList.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', function() {
                    const candidateId = this.getAttribute('data-id');
                    editCandidate(candidateId);
                });
            });
            
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', function() {
                    const candidateId = this.getAttribute('data-id');
                    if (confirm('Apakah Anda yakin ingin menghapus kandidat ini?')) {
                        deleteCandidate(candidateId);
                    }
                });
            });
            
            // Add event listeners to checkboxes
            document.querySelectorAll('.candidate-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', updateSelectedButtonVisibility);
            });
        })
        .catch(error => {
            console.error("Error saat memuat kandidat:", error);
            candidatesList.innerHTML = `<tr><td colspan="7" class="py-3 px-4 text-center text-red-500">Error: ${error.message}</td></tr>`;
            throw error;
        });
}

// Fungsi untuk menambahkan kandidat baru
function addCandidate(candidateData) {
    return database.ref('candidates').push(candidateData)
        .then(() => {
            console.log("Kandidat berhasil ditambahkan");
            return loadCandidates();
        });
}

// Fungsi untuk mengedit kandidat
function editCandidate(candidateId) {
    return database.ref('candidates/' + candidateId).once('value')
        .then(snapshot => {
            const candidate = snapshot.val();
            
            document.getElementById('editCandidateId').value = candidateId;
            document.getElementById('editNrp').value = candidate.nrp;
            document.getElementById('editPassword').value = candidate.password;
            document.getElementById('editName').value = candidate.name || '';
            document.getElementById('editCode').value = candidate.code || '';
            document.getElementById('editStatus').value = candidate.status;
            
            document.getElementById('editCandidateModal').classList.remove('hidden');
        });
}

// Fungsi untuk menyimpan perubahan kandidat
function saveCandidate(candidateId, updatedData) {
    return database.ref('candidates/' + candidateId).update(updatedData)
        .then(() => loadCandidates());
}

// Fungsi untuk menghapus kandidat
function deleteCandidate(candidateId) {
    return database.ref('candidates/' + candidateId).remove()
        .then(() => loadCandidates());
}

// Fungsi untuk menghapus kandidat terpilih
function deleteSelectedCandidates() {
    const selectedCheckboxes = document.querySelectorAll('.candidate-checkbox:checked');
    
    if (selectedCheckboxes.length === 0) {
        return Promise.reject(new Error('Tidak ada kandidat yang dipilih'));
    }
    
    const deletePromises = Array.from(selectedCheckboxes).map(checkbox => {
        const candidateId = checkbox.getAttribute('data-id');
        return database.ref('candidates/' + candidateId).remove();
    });
    
    return Promise.all(deletePromises)
        .then(() => loadCandidates());
}

// Fungsi untuk menginisialisasi data default
function initializeData() {
    return database.ref('candidates').once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                console.log("Data tidak ditemukan, menginisialisasi dengan data default");
                
                const promises = defaultCandidates.map((candidate, index) => {
                    return database.ref('candidates/' + index).set(candidate);
                });
                
                return Promise.all(promises);
            }
            return Promise.resolve();
        });
}

// Fungsi untuk mengimpor data dari CSV
function importFromCSV(csvData) {
    if (!csvData || csvData.length === 0) {
        return Promise.reject(new Error('Tidak ada data yang diimpor'));
    }
    
    const candidatesRef = database.ref('candidates');
    const batchSize = 50;
    const totalBatches = Math.ceil(csvData.length / batchSize);
    
    let importCount = 0;
    let errorCount = 0;
    
    function processBatch(batchIndex) {
        if (batchIndex >= totalBatches) {
            return Promise.resolve({ importCount, errorCount });
        }
        
        const startIdx = batchIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, csvData.length);
        const currentBatch = csvData.slice(startIdx, endIdx);
        
        const promises = currentBatch.map(candidate => {
            if (!candidate.nrp || !candidate.password) {
                errorCount++;
                return Promise.resolve();
            }
            
            if (candidate.status !== 'lulus' && candidate.status !== 'tidak') {
                candidate.status = 'tidak';
            }
            
            return candidatesRef.push(candidate)
                .then(() => importCount++)
                .catch(() => errorCount++);
        });
        
        return Promise.all(promises)
            .then(() => processBatch(batchIndex + 1));
    }
    
    return processBatch(0);
}

// Fungsi untuk memperbarui tampilan tombol terpilih
function updateSelectedButtonVisibility() {
    const checkboxes = document.querySelectorAll('.candidate-checkbox:checked');
    const deleteSelectedButton = document.getElementById('deleteSelectedButton');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    
    if (checkboxes.length > 0) {
        deleteSelectedButton.classList.remove('hidden');
        deleteSelectedButton.textContent = `Hapus Terpilih (${checkboxes.length})`;
        
        // Update select all checkbox state
        const allCheckboxes = document.querySelectorAll('.candidate-checkbox');
        selectAllCheckbox.checked = checkboxes.length === allCheckboxes.length;
        selectAllCheckbox.indeterminate = checkboxes.length > 0 && checkboxes.length < allCheckboxes.length;
    } else {
        deleteSelectedButton.classList.add('hidden');
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    }
}

// Fungsi untuk memperbarui jumlah yang dipilih
function updateSelectedCount(count) {
    const deleteSelectedButton = document.getElementById('deleteSelectedButton');
    
    if (count > 0) {
        deleteSelectedButton.classList.remove('hidden');
        deleteSelectedButton.textContent = `Hapus Terpilih (${count})`;
    } else {
        deleteSelectedButton.classList.add('hidden');
    }
}

// Export fungsi yang diperlukan
window.databaseFunctions = {
    standardMessages,
    checkCandidate,
    loadCandidates,
    addCandidate,
    editCandidate,
    saveCandidate,
    deleteCandidate,
    deleteSelectedCandidates,
    initializeData,
    importFromCSV,
    updateSelectedButtonVisibility
};

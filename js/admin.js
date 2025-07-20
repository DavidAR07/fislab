// Fungsi untuk inisialisasi admin dashboard
function initAdminDashboard() {
    // Event listener untuk form tambah kandidat
    document.getElementById('addCandidateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newCandidate = {
            nrp: document.getElementById('newNrp').value,
            password: document.getElementById('newPassword').value,
            name: document.getElementById('newName').value,
            code: document.getElementById('newCode').value,
            status: document.getElementById('newStatus').value
        };
        
        addCandidate(newCandidate)
            .then(() => {
                document.getElementById('addCandidateForm').reset();
                alert('Kandidat berhasil ditambahkan!');
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    });
    
    // Event listener untuk form edit kandidat
    document.getElementById('editCandidateForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const candidateId = document.getElementById('editCandidateId').value;
        const updatedCandidate = {
            nrp: document.getElementById('editNrp').value,
            password: document.getElementById('editPassword').value,
            name: document.getElementById('editName').value,
            code: document.getElementById('editCode').value,
            status: document.getElementById('editStatus').value
        };
        
        saveCandidate(candidateId, updatedCandidate)
            .then(() => {
                document.getElementById('editCandidateModal').classList.add('hidden');
                alert('Kandidat berhasil diperbarui!');
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    });
    
    // Event listener untuk tombol batal edit
    document.getElementById('cancelEdit').addEventListener('click', function() {
        document.getElementById('editCandidateModal').classList.add('hidden');
    });
    
    // Event listener untuk input file CSV
    document.getElementById('csvFileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    const csvData = parseCSV(content);
                    
                    if (csvData.length === 0) {
                        alert('Tidak ada data valid yang ditemukan dalam file. Pastikan format file sesuai.');
                        return;
                    }
                    
                    // Show preview
                    const csvPreviewBody = document.getElementById('csvPreviewBody');
                    csvPreviewBody.innerHTML = '';
                    
                    const previewRows = csvData.slice(0, 10);
                    previewRows.forEach((row) => {
                        const tr = document.createElement('tr');
                        tr.className = 'border-b border-gray-700';
                        tr.innerHTML = `
                            <td class="py-2 px-3">${row.nrp || '-'}</td>
                            <td class="py-2 px-3">${row.password || '-'}</td>
                            <td class="py-2 px-3">${row.name || '-'}</td>
                            <td class="py-2 px-3">${row.code || '-'}</td>
                            <td class="py-2 px-3">${row.status || '-'}</td>
                        `;
                        csvPreviewBody.appendChild(tr);
                    });
                    
                    if (csvData.length > 10) {
                        const tr = document.createElement('tr');
                        tr.className = 'border-b border-gray-700';
                        tr.innerHTML = `
                            <td colspan="5" class="py-2 px-3 text-center text-gray-400">
                                ... dan ${csvData.length - 10} data lainnya (total ${csvData.length} data)
                            </td>
                        `;
                        csvPreviewBody.appendChild(tr);
                    }
                    
                    document.getElementById('csvPreview').classList.remove('hidden');
                    window.parsedCsvData = csvData;
                } catch (error) {
                    alert(`Error saat memproses file: ${error.message}`);
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Event listener untuk tombol import CSV
    document.getElementById('importCsvButton').addEventListener('click', function() {
        if (!window.parsedCsvData || window.parsedCsvData.length === 0) {
            alert('Silakan pilih file CSV terlebih dahulu');
            return;
        }
        
        if (confirm(`Apakah Anda yakin ingin mengimpor ${window.parsedCsvData.length} data kandidat?`)) {
            importFromCSV(window.parsedCsvData)
                .then(({ importCount, errorCount }) => {
                    alert(`Import selesai. ${importCount} data berhasil diimpor, ${errorCount} data gagal.`);
                    document.getElementById('csvPreview').classList.add('hidden');
                    document.getElementById('csvFileInput').value = '';
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
        }
    });
    
    // Event listener untuk select all checkbox
    document.getElementById('selectAllCheckbox').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.candidate-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateSelectedButtonVisibility();
    });
    
    // Event listener untuk tombol hapus terpilih
    document.getElementById('deleteSelectedButton').addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.candidate-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            alert('Tidak ada kandidat yang dipilih');
            return;
        }
        
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedCheckboxes.length} kandidat terpilih?`)) {
            deleteSelectedCandidates()
                .then(() => {
                    alert('Kandidat terpilih berhasil dihapus');
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
        }
    });
    
    // Event listener untuk tombol logout
    document.getElementById('logoutAdmin').addEventListener('click', function() {
        logoutAdmin();
    });
    
    // Event listener untuk tombol batal login admin
    document.getElementById('cancelAdminLogin').addEventListener('click', function() {
        document.getElementById('adminLoginModal').classList.add('hidden');
    });
    
    // Event listener untuk tombol close modal hayoo
    document.getElementById('closeHayooModal').addEventListener('click', function() {
        document.getElementById('hayooModal').classList.add('hidden');
    });
    
    // Event listener untuk tombol close modal result
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('resultModal').classList.add('hidden');
    });
}

// Export fungsi yang diperlukan
window.adminFunctions = {
    initAdminDashboard
};

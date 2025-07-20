/ Fungsi untuk memuat daftar kandidat
function loadCandidates() {
    console.log("Memuat daftar kandidat...");
    const candidatesList = document.getElementById('candidatesList');
    if (!candidatesList) {
        console.error("Element candidatesList tidak ditemukan");
        return;
    }
    
    candidatesList.innerHTML = '<tr><td colspan="7" class="py-3 px-4 text-center">Memuat data...</td></tr>';
    
    database.ref('candidates').once('value')
        .then(snapshot => {
            console.log("Data kandidat diterima:", snapshot.exists());
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
                console.log("Menampilkan kandidat:", candidate.nrp);
                
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
        });
}

// Fungsi untuk menghitung jumlah checkbox yang dipilih dan memperbarui tombol hapus
function updateSelectedButtonVisibility() {
    const checkboxes = document.querySelectorAll('.candidate-checkbox:checked');
    const deleteSelectedButton = document.getElementById('deleteSelectedButton');
    
    if (checkboxes.length > 0) {
        deleteSelectedButton.classList.remove('hidden');
        deleteSelectedButton.textContent = `Hapus Terpilih (${checkboxes.length})`;
    } else {
        deleteSelectedButton.classList.add('hidden');
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

// Fungsi untuk edit kandidat
function editCandidate(candidateId) {
    database.ref('candidates/' + candidateId).once('value', snapshot => {
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

// Fungsi untuk hapus kandidat
function deleteCandidate(candidateId) {
    database.ref('candidates/' + candidateId).remove()
        .then(() => {
            loadCandidates();
            alert('Kandidat berhasil dihapus!');
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
}

// Event listeners untuk admin
document.addEventListener('DOMContentLoaded', function() {
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const loginError = document.getElementById('loginError');
        
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                // Hide login modal
                document.getElementById('adminLoginModal').classList.add('hidden');
                
                // Show admin dashboard
                document.getElementById('adminDashboard').classList.remove('hidden');
                
                // Load candidates
                loadCandidates();
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
            });
    });
    
    // Logout admin
    document.getElementById('logoutAdmin').addEventListener('click', function() {
        auth.signOut().then(() => {
            document.getElementById('adminDashboard').classList.add('hidden');
        });
    });
    
    // Add candidate form
    const addCandidateForm = document.getElementById('addCandidateForm');
    if (addCandidateForm) {
        console.log("Form tambah kandidat ditemukan");
        addCandidateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form tambah kandidat disubmit");
            
            // Periksa login admin
            const user = firebase.auth().currentUser;
            if (!user) {
                console.error("Admin tidak login");
                alert("Anda harus login sebagai admin untuk menambahkan kandidat");
                return;
            }
            
            const newCandidate = {
                nrp: document.getElementById('newNrp').value,
                password: document.getElementById('newPassword').value,
                name: document.getElementById('newName').value,
                code: document.getElementById('newCode').value,
                status: document.getElementById('newStatus').value
            };
            
            console.log("Data kandidat baru:", newCandidate);
            
            // Tambahkan ke Firebase dengan metode alternatif
            try {
                console.log("Menambahkan kandidat ke database...");
                const candidatesRef = firebase.database().ref('candidates');
                candidatesRef.push(newCandidate)
                    .then(() => {
                        console.log("✅ Kandidat berhasil ditambahkan");
                        document.getElementById('addCandidateForm').reset();
                        alert('Kandidat berhasil ditambahkan!');
                        
                        // Reload candidates dengan timeout
                        setTimeout(function() {
                            console.log("Memuat ulang daftar kandidat");
                            loadCandidates();
                        }, 1000);
                    })
                    .catch(error => {
                        console.error("❌ Error saat menambahkan kandidat:", error);
                        alert('Error: ' + error.message);
                    });
            } catch (error) {
                console.error("❌ Exception saat menambahkan kandidat:", error);
                alert('Error: ' + error.message);
            }
        });
    }
    
    // Cancel edit
    document.getElementById('cancelEdit').addEventListener('click', function() {
        document.getElementById('editCandidateModal').classList.add('hidden');
    });
    
    // Edit candidate form
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
        
        // Update in Firebase
        database.ref('candidates/' + candidateId).update(updatedCandidate)
            .then(() => {
                // Hide modal
                document.getElementById('editCandidateModal').classList.add('hidden');
                
                // Reload candidates
                loadCandidates();
                
                alert('Kandidat berhasil diperbarui!');
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    });
    
    // Select all checkbox
    document.getElementById('selectAllCheckbox').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.candidate-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateSelectedButtonVisibility();
    });
    
    // Delete selected button
    document.getElementById('deleteSelectedButton').addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.candidate-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            alert('Tidak ada kandidat yang dipilih');
            return;
        }
        
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedCheckboxes.length} kandidat terpilih?`)) {
            let deleteCount = 0;
            let errorCount = 0;
            
            selectedCheckboxes.forEach(checkbox => {
                const candidateId = checkbox.getAttribute('data-id');
                
                database.ref('candidates/' + candidateId).remove()
                    .then(() => {
                        deleteCount++;
                        
                        if (deleteCount + errorCount === selectedCheckboxes.length) {
                            alert(`Berhasil menghapus ${deleteCount} kandidat, ${errorCount} gagal dihapus.`);
                            loadCandidates();
                        }
                    })
                    .catch(error => {
                        console.error("Error saat menghapus kandidat:", error);
                        errorCount++;
                        
                        if (deleteCount + errorCount === selectedCheckboxes.length) {
                            alert(`Berhasil menghapus ${deleteCount} kandidat, ${errorCount} gagal dihapus.`);
                            loadCandidates();
                        }
                    });
            });
        }
    });
    
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            console.log("Admin sudah login:", user.email);
            document.getElementById('adminDashboard').classList.remove('hidden');
            loadCandidates();
        } else {
            console.log("Admin belum login");
        }
    });
});

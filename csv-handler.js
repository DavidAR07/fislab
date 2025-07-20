// Fungsi untuk parsing CSV yang diperbaiki
function parseCSV(text) {
    // Deteksi jika file adalah binary (Excel/ZIP/dll)
    function isBinaryContent(content) {
        // Cek apakah konten mengandung banyak karakter non-printable
        const nonPrintableChars = content.split('').filter(char => {
            const code = char.charCodeAt(0);
            return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code > 126;
        }).length;
        
        // Jika lebih dari 5% karakter adalah non-printable, kemungkinan binary
        return (nonPrintableChars / content.length) > 0.05;
    }
    
    // Jika konten terdeteksi sebagai binary
    if (isBinaryContent(text)) {
        alert('File yang Anda unggah sepertinya bukan file CSV yang valid. File terdeteksi sebagai binary (Excel/ZIP/dll). Pastikan file dalam format CSV (text) dan bukan format binary.');
        return [];
    }
    
    // Bersihkan teks dari karakter non-printable dan header yang tidak perlu
    let cleanedText = '';
    let inTextData = false;
    let dataStarted = false;
    
    // Cari bagian teks yang valid
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        
        // Jika menemukan karakter printable, mulai mengumpulkan data
        if ((charCode >= 32 && charCode <= 126) || charCode === 9 || charCode === 10 || charCode === 13) {
            if (!inTextData) {
                inTextData = true;
            }
            cleanedText += text[i];
        } else if (inTextData) {
            // Jika sudah dalam mode teks dan menemukan karakter non-printable,
            // tambahkan newline untuk memisahkan bagian data yang valid
            cleanedText += '\n';
            inTextData = false;
        }
    }
    
    // Hapus baris kosong berlebih
    cleanedText = cleanedText.replace(/\n\s*\n/g, '\n').trim();
    
    // Coba deteksi pemisah (koma atau titik koma)
    let separator = ',';
    if (cleanedText.indexOf(';') > -1 && cleanedText.indexOf(',') === -1) {
        separator = ';';
    }
    
    // Split berdasarkan baris
    const lines = cleanedText.split('\n');
    const result = [];
    
    // Proses setiap baris
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        // Jika baris dimulai dengan karakter aneh, lewati
        if (line.charCodeAt(0) < 32 || line.charCodeAt(0) > 126) {
            continue;
        }
        
        // Split baris menjadi kolom
        const values = line.split(separator);
        
        // Pastikan ada minimal 2 kolom (NRP dan password)
        if (values.length >= 2) {
            // Bersihkan nilai dari karakter khusus dan quotes
            const cleanValues = values.map(val => {
                return val.trim().replace(/^["']|["']$/g, ''); // Hapus quotes di awal dan akhir
            });
            
            // Buat objek kandidat dengan nilai default jika tidak ada
            const candidate = {
                nrp: cleanValues[0] || '',
                password: cleanValues[1] || '',
                name: cleanValues[2] || '',
                code: cleanValues[3] || '',
                status: (cleanValues[4] || '').toLowerCase() === 'lulus' ? 'lulus' : 'tidak'
            };
            
            // Validasi data minimal
            if (candidate.nrp && candidate.password) {
                result.push(candidate);
            }
        }
    }
    
    return result;
}

// Event listener untuk CSV file input
document.addEventListener('DOMContentLoaded', function() {
    // CSV file input change
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
                    const csvPreview = document.getElementById('csvPreview');
                    const csvPreviewBody = document.getElementById('csvPreviewBody');
                    
                    csvPreviewBody.innerHTML = '';
                    
                    // Tampilkan maksimal 10 baris untuk preview
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
                    
                    // Tambahkan informasi jumlah data
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
                    
                    csvPreview.classList.remove('hidden');
                    
                    // Store the parsed data for later use
                    window.parsedCsvData = csvData;
                    
                    console.log(`Berhasil memproses ${csvData.length} data dari CSV`);
                } catch (error) {
                    console.error("Error saat memproses file:", error);
                    alert(`Error saat memproses file: ${error.message}`);
                }
            };
            
            // Baca file sebagai text
            reader.readAsText(file);
        }
    });
    
    // Import CSV button
    document.getElementById('importCsvButton').addEventListener('click', function() {
        const fileInput = document.getElementById('csvFileInput');
        if (fileInput.files.length === 0) {
            alert('Silakan pilih file CSV terlebih dahulu');
            return;
        }
        
        const file = fileInput.files[0];
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
                const csvPreview = document.getElementById('csvPreview');
                const csvPreviewBody = document.getElementById('csvPreviewBody');
                
                csvPreviewBody.innerHTML = '';
                
                // Tampilkan maksimal 10 baris untuk preview
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
                
                // Tambahkan informasi jumlah data
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
                
                csvPreview.classList.remove('hidden');
                
                // Store the parsed data for later use
                window.parsedCsvData = csvData;
                
                console.log(`Berhasil memproses ${csvData.length} data dari CSV`);
            } catch (error) {
                console.error("Error saat memproses file:", error);
                alert(`Error saat memproses file: ${error.message}`);
            }
        };
        
        // Baca file sebagai text
        reader.readAsText(file);
    });
    
    // Confirm import button
    document.getElementById('confirmImportButton').addEventListener('click', function() {
        if (!window.parsedCsvData || window.parsedCsvData.length === 0) {
            alert('Tidak ada data yang diimpor');
            return;
        }
        
        // Periksa login admin
        const user = firebase.auth().currentUser;
        if (!user) {
            console.error("Admin tidak login");
            alert("Anda harus login sebagai admin untuk mengimpor data");
            return;
        }
        
        const candidatesRef = firebase.database().ref('candidates');
        let importCount = 0;
        let errorCount = 0;
        
        // Tampilkan loading message
        alert(`Memulai import ${window.parsedCsvData.length} data...`);
        
        // Batch import untuk kinerja yang lebih baik
        const batchSize = 50;
        const totalBatches = Math.ceil(window.parsedCsvData.length / batchSize);
        
        function processBatch(batchIndex) {
            if (batchIndex >= totalBatches) {
                // Semua batch selesai
                alert(`Import selesai. ${importCount} data berhasil diimpor, ${errorCount} data gagal.`);
                loadCandidates();
                document.getElementById('csvPreview').classList.add('hidden');
                document.getElementById('csvFileInput').value = '';
                return;
            }
            
            const startIdx = batchIndex * batchSize;
            const endIdx = Math.min(startIdx + batchSize, window.parsedCsvData.length);
            const currentBatch = window.parsedCsvData.slice(startIdx, endIdx);
            
            console.log(`Memproses batch ${batchIndex + 1}/${totalBatches} (${startIdx}-${endIdx-1})`);
            
            // Buat promises untuk semua operasi dalam batch ini
            const promises = currentBatch.map(candidate => {
                // Validasi data
                if (!candidate.nrp || !candidate.password) {
                    console.error("Data tidak lengkap:", candidate);
                    errorCount++;
                    return Promise.resolve(); // Skip item ini
                }
                
                // Pastikan status valid
                if (candidate.status !== 'lulus' && candidate.status !== 'tidak') {
                    candidate.status = 'tidak'; // Default ke tidak lulus jika status tidak valid
                }
                
                return candidatesRef.push(candidate)
                    .then(() => {
                        importCount++;
                        console.log(`Imported ${importCount}/${window.parsedCsvData.length}`);
                    })
                    .catch(error => {
                        console.error("Error saat mengimpor data:", error);
                        errorCount++;
                    });
            });
            
            // Setelah batch ini selesai, proses batch berikutnya
            Promise.all(promises)
                .then(() => {
                    console.log(`Batch ${batchIndex + 1} selesai. Progress: ${importCount + errorCount}/${window.parsedCsvData.length}`);
                    processBatch(batchIndex + 1);
                })
                .catch(error => {
                    console.error("Error dalam batch:", error);
                    processBatch(batchIndex + 1); // Tetap lanjut ke batch berikutnya
                });
        }
        
        // Mulai dengan batch pertama
        processBatch(0);
    });
});

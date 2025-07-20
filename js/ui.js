// Fungsi untuk menampilkan modal hasil
function showResultModal(found, candidate) {
    const modal = document.getElementById('resultModal');
    const modalHeader = document.getElementById('modalHeader');
    const statusIcon = document.getElementById('statusIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultDetails = document.getElementById('resultDetails');
    const documentContainer = document.getElementById('documentContainer');
    const documentLink = document.getElementById('documentLink');
    const codeContainer = document.getElementById('codeContainer');
    const candidateCode = document.getElementById('candidateCode');
    const warningContainer = document.getElementById('warningContainer');
    
    if (found && candidate) {
        if (candidate.status === "lulus") {
            modalHeader.className = "p-4 text-white text-center bg-red-900";
            statusIcon.className = "mx-auto mb-2 w-16 h-16 flex items-center justify-center rounded-full bg-black";
            statusIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>';
            resultTitle.textContent = "SELAMAT!";
            resultDetails.textContent = standardMessages.lulus;
            
            // Show document button for successful candidates
            documentContainer.classList.remove('hidden');
            documentLink.href = "https://drive.google.com/file/d/example/view"; // Replace with your actual PDF link
            
            // Show warning message
            warningContainer.classList.remove('hidden');
            
            // Show candidate code
            if (candidate.code) {
                codeContainer.classList.remove('hidden');
                candidateCode.textContent = candidate.code;
            } else {
                codeContainer.classList.add('hidden');
            }
        } else {
            modalHeader.className = "p-4 text-white text-center bg-gray-800";
            statusIcon.className = "mx-auto mb-2 w-16 h-16 flex items-center justify-center rounded-full bg-black";
            statusIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
            resultTitle.textContent = "MOHON MAAF";
            resultDetails.textContent = standardMessages.tidak;
            
            // Hide document button for unsuccessful candidates
            documentContainer.classList.add('hidden');
            
            // Hide warning message
            warningContainer.classList.add('hidden');
            
            // Hide code container
            codeContainer.classList.add('hidden');
        }
    } else {
        modalHeader.className = "p-4 text-white text-center bg-yellow-900";
        statusIcon.className = "mx-auto mb-2 w-16 h-16 flex items-center justify-center rounded-full bg-black";
        statusIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
        resultTitle.textContent = "DATA TIDAK DITEMUKAN";
        resultDetails.textContent = "NRP atau kata sandi yang Anda masukkan tidak valid. Silakan periksa kembali dan coba lagi.";
        
        // Hide document button for not found
        documentContainer.classList.add('hidden');
        
        // Hide warning message
        warningContainer.classList.add('hidden');
        
        // Hide code container
        codeContainer.classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
}

// Fungsi untuk toggle password visibility
function togglePasswordVisibility() {
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
}

// Fungsi untuk parsing CSV
function parseCSV(text) {
    // Deteksi jika file adalah binary (Excel/ZIP/dll)
    function isBinaryContent(content) {
        const nonPrintableChars = content.split('').filter(char => {
            const code = char.charCodeAt(0);
            return (code < 32 && code !== 9 && code !== 10 && code !== 13) || code > 126;
        }).length;
        
        return (nonPrintableChars / content.length) > 0.05;
    }
    
    if (isBinaryContent(text)) {
        alert('File yang Anda unggah sepertinya bukan file CSV yang valid. File terdeteksi sebagai binary (Excel/ZIP/dll). Pastikan file dalam format CSV (text) dan bukan format binary.');
        return [];
    }
    
    let cleanedText = '';
    let inTextData = false;
    
    // Bersihkan teks dari karakter non-printable
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        
        if ((charCode >= 32 && charCode <= 126) || charCode === 9 || charCode === 10 || charCode === 13) {
            if (!inTextData) inTextData = true;
            cleanedText += text[i];
        } else if (inTextData) {
            cleanedText += '\n';
            inTextData = false;
        }
    }
    
    cleanedText = cleanedText.replace(/\n\s*\n/g, '\n').trim();
    
    // Deteksi pemisah (koma atau titik koma)
    let separator = ',';
    if (cleanedText.indexOf(';') > -1 && cleanedText.indexOf(',') === -1) {
        separator = ';';
    }
    
    const lines = cleanedText.split('\n');
    const result = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        
        if (line.charCodeAt(0) < 32 || line.charCodeAt(0) > 126) continue;
        
        const values = line.split(separator);
        
        if (values.length >= 2) {
            const cleanValues = values.map(val => val.trim().replace(/^["']|["']$/g, ''));
            
            const candidate = {
                nrp: cleanValues[0] || '',
                password: cleanValues[1] || '',
                name: cleanValues[2] || '',
                code: cleanValues[3] || '',
                status: (cleanValues[4] || '').toLowerCase() === 'lulus' ? 'lulus' : 'tidak'
            };
            
            if (candidate.nrp && candidate.password) {
                result.push(candidate);
            }
        }
    }
    
    return result;
}

// Export fungsi yang diperlukan
window.uiFunctions = {
    showResultModal,
    togglePasswordVisibility,
    parseCSV
};

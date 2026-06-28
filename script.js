const out = document.getElementById('result');
const cameraBtn = document.getElementById('start-camera');
const fileInput = document.getElementById('file');
const copyBtn = document.getElementById('copy');
const webLink = document.getElementById('web-link'); // HTML එකෙන් ලින්ක් එක ගන්නවා

let scanner;

function onScanSuccess(decodedText) {
    out.value = decodedText;

    // ලින්ක් එකක්ද බලනවා
    if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
        webLink.href = decodedText; // බටන් එකට ලින්ක් එක දෙනවා
        webLink.style.display = "inline-block"; // බටන් එක පෙන්වනවා
    } else {
        webLink.style.display = "none"; // ලින්ක් එකක් නොවේ නම් හංගනවා
    }
}

// 1. කැමරාව ක්‍රියාත්මක කිරීම
cameraBtn.addEventListener('click', () => {
    if (!scanner) {
        scanner = new Html5Qrcode("reader");
    }
    cameraBtn.innerText = "Starting Camera...";
    cameraBtn.disabled = true;
    scanner.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
    ).then(() => {
        cameraBtn.innerText = "Camera Scanning Active";
    }).catch(err => {
        console.error(err);
        cameraBtn.innerText = "Error Starting Camera";
        cameraBtn.disabled = false;
    });
});

// 2. ෆයිල් ස්කෑන් කිරීම
fileInput.addEventListener('change', e => {
    const f = e.target.files[0]; 
    if (!f) return;
    if(scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.stop().then(() => { performFileScan(f); });
    } else {
        performFileScan(f);
    }
});

function performFileScan(file) {
    const tempScanner = new Html5Qrcode("reader");
    tempScanner.scanFile(file, true)
        .then(onScanSuccess)
        .catch(err => {
            alert("No QR code found.");
            webLink.style.display = "none";
        })
        .finally(() => { tempScanner.clear(); });
}

copyBtn.onclick = () => {
    if (out.value) {
        navigator.clipboard.writeText(out.value);
        alert("Copied!");
    }
};
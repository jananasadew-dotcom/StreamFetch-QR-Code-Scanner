const out = document.getElementById('result');
const cameraBtn = document.getElementById('start-camera');
const fileInput = document.getElementById('file');
const copyBtn = document.getElementById('copy');

let scanner;

// Function to handle successful scans
function onScanSuccess(decodedText) {
    out.value = decodedText;
}

// 1. Camera Scanning
cameraBtn.addEventListener('click', () => {
    // Prevent starting multiple instances
    if (!scanner) {
        scanner = new Html5Qrcode("reader");
    }

    cameraBtn.innerText = "Starting Camera...";
    cameraBtn.disabled = true;

    scanner.start(
        { facingMode: "environment" }, // Attempt to use back camera
        {
            fps: 10,    // Frames per second for scanning
            qrbox: { width: 250, height: 250 } // Size of the scanning box
        },
        onScanSuccess
    ).then(() => {
        cameraBtn.innerText = "Camera Scanning Active";
        // Optionally add logic to change the viewfinder icon/text to blank or a 'stop' button
    })
    .catch(err => {
        console.error("Unable to start camera:", err);
        cameraBtn.innerText = "Error Starting Camera";
        cameraBtn.disabled = false;
        alert("Camera permission denied or camera not found. Please ensure you are using HTTPS.");
    });
});

// 2. File Scanning
fileInput.addEventListener('change', e => {
    const f = e.target.files[0]; 
    if (!f) return;
    
    // Check if a scanner instance exists, stop it if it is running
    if(scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.stop().then(() => {
            // Once camera stops, perform file scan
            performFileScan(f);
        });
    } else {
        performFileScan(f);
    }
});

function performFileScan(file) {
    const tempScanner = new Html5Qrcode("reader");
    tempScanner.scanFile(file, true)
        .then(onScanSuccess)
        .catch(err => {
            console.error("QR file scan error:", err);
            alert("No QR code found in this image.");
        })
        .finally(() => {
            tempScanner.clear(); // Clean up temporary instance
        });
}

// 3. Copy Button
copyBtn.onclick = () => {
    if (out.value) {
        navigator.clipboard.writeText(out.value);
        alert("Result text copied to clipboard!");
    } else {
        alert("Nothing to copy!");
    }
};
const out = document.getElementById('result');
const cameraBtn = document.getElementById('start-camera');
const fileInput = document.getElementById('file');
const copyBtn = document.getElementById('copy');

let scanner;

// QR එක සාර්ථකව ස්කෑන් වුණාම ක්‍රියාත්මක වන කොටස
function onScanSuccess(decodedText) {
    out.value = decodedText;

    // 🔗 Auto Open Feature: ලින්ක් එකක්ද කියලා පරික්ෂා කිරීම
    if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
        // බ්‍රවුසර් එකෙන් auto open වීම block කරන එක වැළැක්වීමට පොඩි alert එකක් දාමු
        alert("Link detected! Opening: " + decodedText);
        window.open(decodedText, '_blank'); // වෙනම ටැබ් එකක ලින්ක් එක ඕපන් වේ
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
        {
            fps: 10,    
            qrbox: { width: 250, height: 250 } 
        },
        onScanSuccess
    ).then(() => {
        cameraBtn.innerText = "Camera Scanning Active";
    })
    .catch(err => {
        console.error("Unable to start camera:", err);
        cameraBtn.innerText = "Error Starting Camera";
        cameraBtn.disabled = false;
        alert("Camera permission denied or camera not found.");
    });
});

// 2. ඉමේජ් එකක් අප්ලෝඩ් කරලා ස්කෑන් කිරීම
fileInput.addEventListener('change', e => {
    const f = e.target.files[0]; 
    if (!f) return;
    
    if(scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        scanner.stop().then(() => {
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
            tempScanner.clear(); 
        });
}

// 3. පිටපත් කිරීම (Copy Button)
copyBtn.onclick = () => {
    if (out.value) {
        navigator.clipboard.writeText(out.value);
        alert("Result text copied to clipboard!");
    } else {
        alert("Nothing to copy!");
    }
};
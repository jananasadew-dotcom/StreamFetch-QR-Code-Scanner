const out = document.getElementById('result');
const cameraBtn = document.getElementById('start-camera');
const fileInput = document.getElementById('file');
const copyBtn = document.getElementById('copy');

let scanner;

// 🔗 පල්ලෙහායින් අලුතින් Go to Website බටන් එකක් හදාගමු
const openLinkBtn = document.createElement('button');
openLinkBtn.innerText = "🌐 Go to Website";
openLinkBtn.style.display = "none"; // මුලින්ම හංගලා තියෙන්නේ
openLinkBtn.style.marginTop = "10px";
openLinkBtn.style.padding = "10px";
openLinkBtn.style.backgroundColor = "#28a745";
openLinkBtn.style.color = "white";
openLinkBtn.style.border = "none";
openLinkBtn.style.borderRadius = "5px";
openLinkBtn.style.cursor = "pointer";
openLinkBtn.style.fontWeight = "bold";
openLinkBtn.style.width = "100%";

// මේ බටන් එක Copy බටන් එකට පල්ලෙහායින් Screen එකට එකතු කරනවා
copyBtn.parentNode.appendChild(openLinkBtn);

// QR එක සාර්ථකව ස්කෑන් වුණාම ක්‍රියාත්මක වන කොටස
function onScanSuccess(decodedText) {
    out.value = decodedText;

    // 🔗 ලින්ක් එකක්ද කියලා පරික්ෂා කිරීම
    if (decodedText.startsWith("http://") || decodedText.startsWith("https://")) {
        // ලින්ක් එකක් නම් "Go to Website" බටන් එක පෙන්වනවා
        openLinkBtn.style.display = "block";
        
        // බටන් එක ක්ලික් කළාම ලින්ක් එක open වෙන්න හදනවා
        openLinkBtn.onclick = () => {
            window.open(decodedText, '_blank');
        };

        // බ්‍රවුසර් එකෙන් බ්ලොක් නොකළොත් auto open වෙන්නත් උත්සාහ කරනවා
        window.open(decodedText, '_blank'); 
    } else {
        // ලින්ක් එකක් නොවේ නම් බටන් එක ආයෙත් හංගනවා
        openLinkBtn.style.display = "none";
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
            openLinkBtn.style.display = "none"; // Error එකක් ආවොත් බටන් එක හංගනවා
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
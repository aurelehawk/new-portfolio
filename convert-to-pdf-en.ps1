# PowerShell script to convert English HTML to PDF using Chrome/Edge
$htmlPath = "d:\Documents\new-portfolio\new-portfolio\cv-pascal-eloumou-en.html"
$pdfPath = "d:\Documents\new-portfolio\new-portfolio\cv-pascal-eloumou-en.pdf"

# Try to find Chrome or Edge
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$edgePath2 = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"

if (Test-Path $chromePath) {
    $browser = $chromePath
}
elseif (Test-Path $edgePath) {
    $browser = $edgePath
}
elseif (Test-Path $edgePath2) {
    $browser = $edgePath2
}
else {
    Write-Host "Neither Chrome nor Edge found. Please install one of them or convert manually."
    exit 1
}

Write-Host "Using browser: $browser"

# Convert HTML to PDF using headless browser
# --no-pdf-header-footer removes the URL and date/time
& $browser --headless --disable-gpu --print-to-pdf="$pdfPath" --no-pdf-header-footer "$htmlPath"

Start-Sleep -Seconds 2

if (Test-Path $pdfPath) {
    Write-Host "English PDF created successfully: $pdfPath"
}
else {
    Write-Host "Failed to create English PDF"
    exit 1
}

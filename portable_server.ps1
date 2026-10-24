param(
    [int]$Port = 8092,
    [string]$RootDir = $PSScriptRoot
)

$ErrorActionPreference = "Continue"
if ([string]::IsNullOrEmpty($RootDir)) {
    $RootDir = (Get-Location).Path
} else {
    $RootDir = (Resolve-Path $RootDir).Path
}

# Verifica se il server è già attivo sulla porta principale
function Test-PortInUse([int]$testPort) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $connect = $client.BeginConnect("127.0.0.1", $testPort, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne(200, $false)
        if ($wait -and $client.Connected) {
            $client.Close()
            return $true
        }
        $client.Close()
    } catch {}
    return $false
}

# Helper robusto per aprire il browser predefinito o Chrome
function Open-Browser([string]$targetUrl) {
    $chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    if (Test-Path $chrome) {
        try {
            Start-Process $chrome -ArgumentList $targetUrl
            return
        } catch {}
    }
    try {
        Start-Process $targetUrl
        return
    } catch {}
    try {
        Start-Process "cmd.exe" -ArgumentList "/c start `"`" `"$targetUrl`""
    } catch {}
}

if (Test-PortInUse $Port) {
    $existingUrl = "http://localhost:$Port/index.html"
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "  SOMBRA RESORT S.a r.l. - Server gia' attivo sulla porta $Port" -ForegroundColor Green
    Write-Host "  Apertura applicazione: $existingUrl" -ForegroundColor White
    Write-Host "======================================================================" -ForegroundColor Cyan
    Open-Browser $existingUrl
    Start-Sleep -Milliseconds 600
    exit 0
}

$MimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".htm"   = "text/html; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".mjs"   = "application/javascript; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".gif"   = "image/gif"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".webp"  = "image/webp"
    ".pdf"   = "application/pdf"
    ".xlsx"  = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ".xls"   = "application/vnd.ms-excel"
    ".docx"  = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ".doc"   = "application/msword"
    ".pptx"  = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ".ppt"   = "application/vnd.ms-powerpoint"
    ".mp4"   = "video/mp4"
    ".mpg4"  = "video/mp4"
    ".mov"   = "video/quicktime"
    ".webm"  = "video/webm"
    ".mp3"   = "audio/mpeg"
    ".wav"   = "audio/wav"
    ".ogg"   = "audio/ogg"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
    ".txt"   = "text/plain; charset=utf-8"
    ".csv"   = "text/csv; charset=utf-8"
    ".zip"   = "application/zip"
}

$listener = $null
$boundPort = $Port
$started = $false

for ($p = $Port; $p -le ($Port + 10); $p++) {
    try {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$p/")
        $listener.Start()
        $boundPort = $p
        $started = $true
        break
    } catch {
        if ($listener -ne $null) {
            try { $listener.Close() } catch {}
        }
    }
}

if (-not $started) {
    Write-Host "[AVVISO] Impossibile avviare il server HTTP locale. Apertura diretta nel browser..." -ForegroundColor Yellow
    Open-Browser (Join-Path $RootDir "index.html")
    Start-Sleep -Milliseconds 600
    exit 0
}

$url = "http://localhost:$boundPort/index.html"
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  SOMBRA RESORT S.a r.l. - Server Portatile Attivo" -ForegroundColor Green
Write-Host "  URL Applicazione : $url" -ForegroundColor Cyan
Write-Host "  Nessuna installazione richiesta (Zero Node.js / Zero Python)" -ForegroundColor Gray
Write-Host "  Lascia questa finestra aperta mentre usi l'applicazione." -ForegroundColor Yellow
Write-Host "  Chiudi questa finestra o premi CTRL+C quando hai terminato." -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""

Open-Browser $url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.OutputStream.Close()
                continue
            }

            $rawPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)

            if ($request.HttpMethod -eq "POST") {
                $response.StatusCode = 200
                $response.ContentType = "application/json; charset=utf-8"
                $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true}')
                $response.ContentLength64 = $jsonBytes.Length
                $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
                $response.OutputStream.Close()
                continue
            }

            if ($rawPath -eq "/" -or [string]::IsNullOrEmpty($rawPath)) {
                $rawPath = "/index.html"
            }

            $relativePath = $rawPath.TrimStart('/').Replace('/', '\')
            $filePath = Join-Path $RootDir $relativePath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
                $contentType = $MimeTypes[$ext]
                if (-not $contentType) { $contentType = "application/octet-stream" }
                $response.ContentType = $contentType

                if ($ext -in @(".mp4", ".mpg4", ".mov", ".webm", ".jpg", ".jpeg", ".png", ".webp", ".pdf")) {
                    $response.Headers.Add("Cache-Control", "public, max-age=3600")
                } else {
                    $response.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
                }

                $fileInfo = New-Object System.IO.FileInfo($filePath)
                $fileLength = $fileInfo.Length

                $fs = [System.IO.File]::Open($filePath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
                try {
                    $rangeHeader = $request.Headers["Range"]
                    if ($rangeHeader -and $rangeHeader -match "bytes=(\d+)-(\d*)") {
                        $start = [int64]$matches[1]
                        $end = if ($matches[2]) { [int64]$matches[2] } else { $fileLength - 1 }
                        if ($end -ge $fileLength) { $end = $fileLength - 1 }
                        $chunkLength = $end - $start + 1

                        $response.StatusCode = 206
                        $response.Headers.Add("Accept-Ranges", "bytes")
                        $response.Headers.Add("Content-Range", "bytes $start-$end/$fileLength")
                        $response.ContentLength64 = $chunkLength

                        $fs.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $buffer = New-Object byte[] 65536
                        $remaining = $chunkLength
                        while ($remaining -gt 0) {
                            $toRead = [Math]::Min($buffer.Length, $remaining)
                            $read = $fs.Read($buffer, 0, $toRead)
                            if ($read -le 0) { break }
                            $response.OutputStream.Write($buffer, 0, $read)
                            $remaining -= $read
                        }
                    } else {
                        $response.StatusCode = 200
                        $response.Headers.Add("Accept-Ranges", "bytes")
                        $response.ContentLength64 = $fileLength
                        $fs.CopyTo($response.OutputStream)
                    }
                } finally {
                    $fs.Close()
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        } catch {
            # Ignora disconnessioni del client durante streaming video/PDF
        } finally {
            try { $response.OutputStream.Close() } catch {}
        }
    }
} finally {
    if ($listener -ne $null) {
        try { $listener.Stop() } catch {}
    }
}

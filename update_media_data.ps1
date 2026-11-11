param(
    [string]$RootDir = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrEmpty($RootDir)) {
    $RootDir = (Get-Location).Path
}
$mediaRoot = Join-Path $RootDir "uploads\Foto e video"
if (-not (Test-Path $mediaRoot)) {
    return
}

function ConvertTo-SombraMediaUrl([string]$relPath) {
    $parts = $relPath -split '[\\/]+'
    $encoded = $parts | ForEach-Object { [System.Uri]::EscapeDataString($_) }
    return ($encoded -join '/')
}

function Get-SombraDossier([System.IO.FileInfo]$file, [string]$mediaRootPath) {
    $relDir = $file.DirectoryName.Substring($mediaRootPath.Length).Trim('\', '/')
    if ($relDir -and $relDir -notmatch '^(FOTO|VIDEO|MUSICA)$') {
        $subParts = $relDir -split '[\\/]+'
        $candidate = $subParts[-1]
        if ($candidate -notmatch '^(FOTO|VIDEO|MUSICA)$') {
            return $candidate
        }
    }
    if ($file.Name -match '(?i)Casa\s*([A-I])\b') {
        return "Villa $($Matches[1].ToUpper())"
    }
    return "Resort"
}

$photoExts = @('.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp')
$videoExts = @('.mp4', '.mov', '.webm', '.m4v')
$audioExts = @('.mp3', '.m4a', '.wav')

$allFiles = Get-ChildItem $mediaRoot -Recurse -File | Sort-Object FullName
$photos = @()
$videos = @()
$audio  = @()
$pIdx = 1; $vIdx = 1; $aIdx = 1

foreach ($f in $allFiles) {
    $ext = $f.Extension.ToLowerInvariant()
    $relFromRoot = $f.FullName.Substring($RootDir.Length + 1).Replace('\', '/')
    $url = ConvertTo-SombraMediaUrl $relFromRoot
    $sizeMb = [Math]::Round($f.Length / 1MB, 2)
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)

    if ($photoExts -contains $ext) {
        $dossier = Get-SombraDossier $f $mediaRoot
        $title = if ($dossier -eq 'Resort') { "Resort - $baseName" } else { "$dossier - $baseName" }
        $photos += [ordered]@{
            id       = "photo_$pIdx"
            filename = $f.Name
            title    = $title
            path     = $relFromRoot
            url      = $url
            villa    = $dossier
            dossier  = $dossier
            size_mb  = $sizeMb
        }
        $pIdx++
    } elseif ($videoExts -contains $ext) {
        $videos += [ordered]@{
            id       = "video_$vIdx"
            filename = $f.Name
            title    = $baseName
            path     = $relFromRoot
            url      = $url
            villa    = "Resort"
            dossier  = "Visites Vidéo"
            size_mb  = $sizeMb
        }
        $vIdx++
    } elseif ($audioExts -contains $ext) {
        $album = $f.Directory.Name
        if ($album -eq 'Foto e video' -or $album -eq 'MUSICA') { $album = 'Sombra Resort Mix' }
        $audio += [ordered]@{
            id       = "audio_$aIdx"
            filename = $f.Name
            title    = $baseName
            album    = $album
            path     = $relFromRoot
            url      = $url
            size_mb  = $sizeMb
        }
        $aIdx++
    }
}

$obj = [ordered]@{
    photos = $photos
    videos = $videos
    audio  = $audio
}
$json = $obj | ConvertTo-Json -Depth 5
$content = @"
/**
 * SOMBRA_RESORT - Media Data Catalog
 * Photos, Videos, and Audio MP3 catalog for the Sombra Resort Media Gallery & Diaporama
 */

const SOMBRA_MEDIA_DATA = $json;

if (typeof window !== 'undefined') {
    window.SOMBRA_MEDIA_DATA = SOMBRA_MEDIA_DATA;
}
"@

$outPath = Join-Path $RootDir "media_data.js"
[System.IO.File]::WriteAllText($outPath, $content, [System.Text.UTF8Encoding]::new($false))
Write-Host "Catalogo SOMBRA_RESORT aggiornato: $($photos.Count) foto, $($videos.Count) video, $($audio.Count) brani."

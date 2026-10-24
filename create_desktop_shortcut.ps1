$WshShell = New-Object -ComObject WScript.Shell

$desktopPaths = @(
    [System.Environment]::GetFolderPath('Desktop'),
    (Join-Path ([System.Environment]::GetFolderPath('UserProfile')) 'OneDrive\Desktop'),
    (Join-Path ([System.Environment]::GetFolderPath('UserProfile')) 'Desktop')
) | Select-Object -Unique

$targetBat = 'C:\Users\Edoardo\.gemini\antigravity\scratch\SOMBRA_RESORT\Avvia SOMBRA_RESORT.bat'
$workingDir = 'C:\Users\Edoardo\.gemini\antigravity\scratch\SOMBRA_RESORT'
$iconPath = 'C:\Users\Edoardo\.gemini\antigravity\scratch\SOMBRA_RESORT\brand_assets\favicon.ico'

$created = @()
foreach ($dp in $desktopPaths) {
    if (Test-Path $dp) {
        $lnkPath = Join-Path $dp 'SOMBRA RESORT.lnk'
        $shortcut = $WshShell.CreateShortcut($lnkPath)
        $shortcut.TargetPath = $targetBat
        $shortcut.WorkingDirectory = $workingDir
        if (Test-Path $iconPath) {
            $shortcut.IconLocation = "$iconPath,0"
        }
        $shortcut.Description = 'Avvia Piattaforma SOMBRA RESORT S.à r.l.'
        $shortcut.WindowStyle = 1
        $shortcut.Save()
        $created += $lnkPath
        Write-Output "Scorciatoia creata in: $lnkPath"
    }
}

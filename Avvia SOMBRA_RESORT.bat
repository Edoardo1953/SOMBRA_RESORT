@echo off
chcp 65001 > nul
title SOMBRA RESORT S.a r.l. - App Portatile
color 0A
cd /d "%~dp0"

echo ======================================================================
echo   SOMBRA RESORT S.a r.l. - Avvio Applicazione Portatile
echo   Holding de Participations - Luxembourg / Bresil
echo ======================================================================
echo.
echo Avvio immediato in corso (Zero installazione richiesta)...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0portable_server.ps1" -Port 8092
if %ERRORLEVEL% NEQ 0 (
    echo Apertura diretta nel browser...
    start "" "%~dp0index.html"
)
exit

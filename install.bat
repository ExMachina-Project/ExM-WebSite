@echo off
rem ===========================================================================
rem  ExMachina . Windows 安装引导
rem  https://github.com/ExMachina-Project/ExMachina
rem
rem  用法:
rem    curl -fsSL -o install.bat https://<本站域名>/install.bat
rem    install.bat
rem ===========================================================================
setlocal EnableExtensions

if "%~1"=="-h" goto :help
if "%~1"=="--help" goto :help

set "REPO=ExMachina-Project/ExMachina"
if not defined EXM_INSTALL_REF set "EXM_INSTALL_REF=main"
set "UPSTREAM=https://raw.githubusercontent.com/%REPO%/%EXM_INSTALL_REF%/scripts/install.bat"
set "TMPBAT=%TEMP%\exm-install-upstream.bat"

echo.
echo   EXMACHINA / installer
echo   collective intelligence system
echo.

echo   ^> checking system
ver

echo   ^> fetching upstream installer
echo     repo  %REPO%
echo     ref   %EXM_INSTALL_REF%
echo.

where curl >nul 2>nul
if %ERRORLEVEL%==0 (
  curl -fsSL --connect-timeout 15 --retry 2 -o "%TMPBAT%" "%UPSTREAM%"
  if errorlevel 1 goto :fetchfail
) else (
  where powershell >nul 2>nul
  if errorlevel 1 (
    echo   X  need curl or PowerShell to download the installer
    exit /b 1
  )
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -Uri '%UPSTREAM%' -OutFile '%TMPBAT%' -UseBasicParsing } catch { exit 1 }"
  if errorlevel 1 goto :fetchfail
)

if not exist "%TMPBAT%" goto :fetchfail
for %%A in ("%TMPBAT%") do if %%~zA==0 goto :fetchfail

echo   ^> handing over to upstream installer
echo.
call "%TMPBAT%" %*
set "STATUS=%ERRORLEVEL%"
del "%TMPBAT%" >nul 2>nul

echo.
if "%STATUS%"=="0" (
  echo   OK  installation complete.
  echo       start the gateway, then open http://127.0.0.1:4173
  echo       configure a provider and API key on the Models page first.
) else (
  echo   X   installation did not finish. exit code %STATUS%
  echo       see https://github.com/%REPO%/blob/%EXM_INSTALL_REF%/docs/安装指南.md
)
echo.

exit /b %STATUS%

:fetchfail
echo   X  failed to download the installer:
echo      %UPSTREAM%
echo.
echo      check network / proxy, or grab it manually from
echo      https://github.com/%REPO%/tree/%EXM_INSTALL_REF%/scripts
exit /b 1

:help
echo.
echo   EXMACHINA . installer
echo.
echo     --bin    install the prebuilt release (no Rust / Node.js needed)
echo     --src    build from source (requires Rust stable and Node.js ^>= 22)
echo     no flag  interactive choice
echo.
echo   environment:
echo     EXM_INSTALL_REF   upstream branch or tag, default main
echo.
exit /b 0

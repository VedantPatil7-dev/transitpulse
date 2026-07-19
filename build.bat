@echo off
echo =========================================
echo Re-Compiling TransitPulse Core System...
echo =========================================

gcc transitpulse.c -o transitpulse.exe -lsqlite3 -Wl,-subsystem,console

if %errorlevel% equ 0 (
    echo.
    echo ✅ SUCCESS! Running Engine...
    echo =========================================
    transitpulse.exe
) else (
    echo.
    echo ❌ FAILED. Ensure transitpulse.c is saved in this folder!
    echo =========================================
)
pause
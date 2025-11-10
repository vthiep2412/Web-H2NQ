if exist startC.bat (
    start startC.bat
) else (
    echo Error: startC.bat not found!
    pause
    exit /b 1
)

if exist startS.bat (
    start startS.bat
) else (
    echo Error: startS.bat not found!
    pause
    exit /b 1
)
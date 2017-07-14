ECHO OFF
CLS
:MENU
ECHO.
ECHO ...............................................
ECHO PRESS 1, 2 OR 3 to select your task, or 4 to EXIT.
ECHO ...............................................
ECHO.
ECHO 1 - Install pm2 globally - optional
ECHO 2 - Setup project - required
ECHO 3 - Open Notepad AND Calculator
ECHO 4 - EXIT
ECHO.
SET /P M=Type 1, 2, 3, or 4 then press ENTER:
IF %M%==1 GOTO PM2
IF %M%==2 GOTO SETUP
IF %M%==3 GOTO BOTH
IF %M%==4 GOTO EOF
:PM2
call npm install pm2 -g
GOTO MENU
:SETUP
call npm install
GOTO MENU
:BOTH
cd %windir%\system32\notepad.exe
start notepad.exe
cd %windir%\system32\calc.exe
start calc.exe
GOTO MENU
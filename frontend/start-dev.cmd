@echo off
cd /d "%~dp0"
set NODE_OPTIONS=--openssl-legacy-provider
set BROWSER=none
call npm start

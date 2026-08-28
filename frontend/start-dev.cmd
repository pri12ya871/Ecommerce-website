@echo off
cd /d "%~dp0"
set NODE_OPTIONS=--openssl-legacy-provider
set BROWSER=none
rem CRA 4's bundled eslint-config-react-app fails to load the jest plugin on
rem this Node version, which breaks every recompile. The build script already
rem disables the plugin for the same reason.
set DISABLE_ESLINT_PLUGIN=true
call npm start

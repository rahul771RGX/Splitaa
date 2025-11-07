@echo off
REM Simple snapshot script for git changes
cd /d %~dp0
echo ------------------------------------------------------------ >> git-change-report.txt
echo Snapshot taken at %DATE% %TIME% >> git-change-report.txt
git status --porcelain >> git-change-report.txt
echo   >> git-change-report.txt
echo Snapshot appended to git-change-report.txt
pause
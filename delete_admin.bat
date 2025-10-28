@echo off
REM Delete the original admin folder if you want to remove the duplicate files.
REM Run this from any shell on Windows to remove e:\Splitaa\admin
set ADMIN_DIR=e:\Splitaa\admin
if exist "%ADMIN_DIR%" (
  echo Removing "%ADMIN_DIR%"...
  rd /s /q "%ADMIN_DIR%"
  if exist "%ADMIN_DIR%" (
    echo Failed to remove "%ADMIN_DIR%".
    exit /b 1
  ) else (
    echo Removed "%ADMIN_DIR%".
  )
) else (
  echo "%ADMIN_DIR%" does not exist.
)
exit /b 0

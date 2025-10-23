@echo off
echo Running payment methods table migration...
echo.

cd /d "%~dp0"
php migrate_payment_methods.php

echo.
pause

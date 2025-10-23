@echo off
echo Running database migration to add expense fields...
echo.

php -r "
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'expense_splitter';

try {
    $pdo = new PDO(\"mysql:host=$host\", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo \"Connected to MySQL successfully\n\";
    
    // Read and execute migration
    $sql = file_get_contents(__DIR__ . '/add_expense_fields.sql');
    $pdo->exec($sql);
    
    echo \"Migration completed successfully!\n\";
    echo \"Added 'category' and 'split_type' columns to expenses table.\n\";
    
} catch (PDOException $e) {
    echo \"Error: \" . $e->getMessage() . \"\n\";
    exit(1);
}
"

echo.
echo Press any key to exit...
pause > nul

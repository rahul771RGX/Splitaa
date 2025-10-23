<?php
/**
 * Database Setup Script
 * Run this to create the database and import schema
 */

echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║         DATABASE SETUP                                     ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

// Step 1: Create database
echo "Step 1: Creating database...\n";
try {
    $pdo = new PDO('mysql:host=localhost;charset=utf8mb4', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS expense_splitter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database 'expense_splitter' created successfully!\n\n";
    
    // Use the database
    $pdo->exec("USE expense_splitter");
    
    // Step 2: Read and execute schema
    echo "Step 2: Creating tables...\n";
    $schemaFile = __DIR__ . '/database/schema.sql';
    
    if (!file_exists($schemaFile)) {
        die("❌ Error: schema.sql file not found at: $schemaFile\n");
    }
    
    $sql = file_get_contents($schemaFile);
    
    // Split SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        function($stmt) {
            return !empty($stmt) && 
                   !preg_match('/^--/', $stmt) && 
                   !preg_match('/^CREATE DATABASE/', $stmt) &&
                   !preg_match('/^USE /', $stmt);
        }
    );
    
    foreach ($statements as $statement) {
        try {
            $pdo->exec($statement);
        } catch (PDOException $e) {
            // Skip errors for existing tables/data
            if (strpos($e->getMessage(), 'Duplicate entry') === false &&
                strpos($e->getMessage(), 'already exists') === false) {
                echo "⚠️  Warning: " . $e->getMessage() . "\n";
            }
        }
    }
    
    echo "✅ All tables created successfully!\n\n";
    
    // Step 3: Verify tables
    echo "Step 3: Verifying tables...\n";
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    $expectedTables = ['users', 'friendships', 'groups', 'group_members', 'categories', 'expenses', 'expense_splits', 'settlements'];
    
    foreach ($expectedTables as $table) {
        if (in_array($table, $tables)) {
            echo "✅ $table\n";
        } else {
            echo "❌ $table (MISSING)\n";
        }
    }
    
    // Step 4: Count records
    echo "\nStep 4: Checking data...\n";
    $counts = [
        'users' => $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),
        'categories' => $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn(),
        'groups' => $pdo->query("SELECT COUNT(*) FROM `groups`")->fetchColumn(),
        'expenses' => $pdo->query("SELECT COUNT(*) FROM expenses")->fetchColumn(),
    ];
    
    foreach ($counts as $table => $count) {
        echo "📊 $table: $count records\n";
    }
    
    // Show test users
    echo "\n=== TEST USERS (password: 'password') ===\n";
    $users = $pdo->query("SELECT id, name, email FROM users")->fetchAll();
    foreach ($users as $user) {
        echo "👤 {$user['name']} ({$user['email']})\n";
    }
    
    echo "\n╔════════════════════════════════════════════════════════════╗\n";
    echo "║  ✅ DATABASE SETUP COMPLETE!                               ║\n";
    echo "╚════════════════════════════════════════════════════════════╝\n\n";
    
    echo "You can now:\n";
    echo "1. Open phpMyAdmin: http://localhost/phpmyadmin\n";
    echo "2. Select 'expense_splitter' database\n";
    echo "3. View all tables and data\n\n";
    
    echo "Test your API:\n";
    echo "- Visit: http://localhost:8000/health\n";
    echo "- Or run: php test-db.php\n\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n\n";
    echo "Make sure:\n";
    echo "1. XAMPP MySQL is running\n";
    echo "2. MySQL is on port 3306\n";
    echo "3. Root password is empty (or update script)\n";
    exit(1);
}
?>

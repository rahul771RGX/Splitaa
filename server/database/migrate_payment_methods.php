<?php
require_once '../config/database.php';

try {
    $db = Database::getInstance();
    $conn = $db->getConnection();
    
    echo "Creating payment_methods table...\n";
    
    $sql = file_get_contents('create_payment_methods_table.sql');
    
    $conn->exec($sql);
    echo "✅ Payment methods table created successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

<?php

class PaymentMethod {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Get all payment methods for a user
    public function getByUserId($userId) {
        try {
            $sql = "SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$userId]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (PDOException $e) {
            error_log("Get payment methods error: " . $e->getMessage());
            return [];
        }
    }
    
    // Create a new payment method
    public function create($data) {
        try {
            $sql = "INSERT INTO payment_methods (user_id, type, upi_id, bank_name, account_number, ifsc_code, is_primary) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            $result = $stmt->execute([
                $data['user_id'],
                $data['type'],
                $data['upi_id'],
                $data['bank_name'],
                $data['account_number'],
                $data['ifsc_code'],
                $data['is_primary']
            ]);
            
            if ($result) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (PDOException $e) {
            error_log("Payment method creation error: " . $e->getMessage());
            throw $e;
        }
    }
    
    // Update payment method
    public function update($id, $userId, $data) {
        $sql = "UPDATE payment_methods 
                SET type = ?, upi_id = ?, bank_name = ?, account_number = ?, ifsc_code = ?, is_primary = ?
                WHERE id = ? AND user_id = ?";
        
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            $data['type'],
            $data['upi_id'],
            $data['bank_name'],
            $data['account_number'],
            $data['ifsc_code'],
            $data['is_primary'],
            $id,
            $userId
        ]);
    }
    
    // Delete payment method
    public function delete($id, $userId) {
        $sql = "DELETE FROM payment_methods WHERE id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$id, $userId]);
    }
    
    // Set as primary payment method
    public function setPrimary($id, $userId) {
        // First, unset all primary flags for this user
        $sql1 = "UPDATE payment_methods SET is_primary = 0 WHERE user_id = ?";
        $stmt1 = $this->conn->prepare($sql1);
        $stmt1->execute([$userId]);
        
        // Then set the selected one as primary
        $sql2 = "UPDATE payment_methods SET is_primary = 1 WHERE id = ? AND user_id = ?";
        $stmt2 = $this->conn->prepare($sql2);
        return $stmt2->execute([$id, $userId]);
    }
}

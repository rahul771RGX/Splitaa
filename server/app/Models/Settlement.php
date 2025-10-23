<?php

require_once __DIR__ . '/../../config/database.php';

class Settlement {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function findById($id) {
        return $this->db->fetchOne(
            "SELECT s.*,
                u1.name as from_user_name, u1.email as from_user_email,
                u2.name as to_user_name, u2.email as to_user_email,
                g.name as group_name
            FROM settlements s
            JOIN users u1 ON s.from_user_id = u1.id
            JOIN users u2 ON s.to_user_id = u2.id
            LEFT JOIN `groups` g ON s.group_id = g.id
            WHERE s.id = ?",
            [$id]
        );
    }
    
    public function findByUser($userId) {
        return $this->db->fetchAll("
            SELECT s.*,
                u1.name as from_user_name,
                u2.name as to_user_name,
                g.name as group_name
            FROM settlements s
            JOIN users u1 ON s.from_user_id = u1.id
            JOIN users u2 ON s.to_user_id = u2.id
            LEFT JOIN `groups` g ON s.group_id = g.id
            WHERE s.from_user_id = ? OR s.to_user_id = ?
            ORDER BY s.settled_at DESC
        ", [$userId, $userId]);
    }
    
    public function findByGroup($groupId) {
        return $this->db->fetchAll("
            SELECT s.*,
                u1.name as from_user_name,
                u2.name as to_user_name
            FROM settlements s
            JOIN users u1 ON s.from_user_id = u1.id
            JOIN users u2 ON s.to_user_id = u2.id
            WHERE s.group_id = ?
            ORDER BY s.settled_at DESC",
            [$groupId]
        );
    }
    
    public function create($data) {
        $this->db->execute(
            "INSERT INTO settlements (from_user_id, to_user_id, amount, payment_method, notes, group_id, settled_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                $data['from_user_id'],
                $data['to_user_id'],
                $data['amount'],
                $data['payment_method'] ?? 'upi',
                $data['notes'] ?? null,
                $data['group_id'] ?? null,
                $data['settled_at'] ?? date('Y-m-d H:i:s')
            ]
        );
        
        return $this->findById($this->db->lastInsertId());
    }
    
    public function delete($id) {
        return $this->db->execute("DELETE FROM settlements WHERE id = ?", [$id]);
    }
    
    public function getSettlementsBetween($userId1, $userId2) {
        return $this->db->fetchAll("
            SELECT s.*,
                u1.name as from_user_name,
                u2.name as to_user_name
            FROM settlements s
            JOIN users u1 ON s.from_user_id = u1.id
            JOIN users u2 ON s.to_user_id = u2.id
            WHERE (s.from_user_id = ? AND s.to_user_id = ?) 
               OR (s.from_user_id = ? AND s.to_user_id = ?)
            ORDER BY s.settled_at DESC",
            [$userId1, $userId2, $userId2, $userId1]
        );
    }
    
    public function getTotalSettled($fromUserId, $toUserId) {
        $result = $this->db->fetchOne(
            "SELECT COALESCE(SUM(amount), 0) as total
            FROM settlements
            WHERE from_user_id = ? AND to_user_id = ?",
            [$fromUserId, $toUserId]
        );
        
        return $result['total'];
    }
}

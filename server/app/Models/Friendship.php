<?php

require_once __DIR__ . '/../../config/database.php';

class Friendship {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function findById($id) {
        return $this->db->fetchOne(
            "SELECT f.*, 
                u1.name as user_name, u1.email as user_email,
                u2.name as friend_name, u2.email as friend_email
            FROM friendships f
            JOIN users u1 ON f.user_id = u1.id
            JOIN users u2 ON f.friend_id = u2.id
            WHERE f.id = ?",
            [$id]
        );
    }
    
    public function findByUsers($userId, $friendId) {
        return $this->db->fetchOne(
            "SELECT * FROM friendships 
            WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
            [$userId, $friendId, $friendId, $userId]
        );
    }
    
    public function create($userId, $friendId, $status = 'accepted') {
        // Check if friendship already exists
        $existing = $this->findByUsers($userId, $friendId);
        
        if ($existing) {
            return false;
        }
        
        $this->db->execute(
            "INSERT INTO friendships (user_id, friend_id, status) VALUES (?, ?, ?)",
            [$userId, $friendId, $status]
        );
        
        return $this->findById($this->db->lastInsertId());
    }
    
    public function updateStatus($id, $status) {
        $this->db->execute(
            "UPDATE friendships SET status = ? WHERE id = ?",
            [$status, $id]
        );
        
        return $this->findById($id);
    }
    
    public function delete($id) {
        return $this->db->execute("DELETE FROM friendships WHERE id = ?", [$id]);
    }
    
    public function getFriends($userId, $status = 'accepted') {
        return $this->db->fetchAll("
            SELECT u.id, u.name, u.email, u.phone, u.avatar, f.status, f.created_at
            FROM friendships f
            JOIN users u ON (
                CASE 
                    WHEN f.user_id = ? THEN f.friend_id = u.id
                    ELSE f.user_id = u.id
                END
            )
            WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = ?
            ORDER BY u.name
        ", [$userId, $userId, $userId, $status]);
    }
    
    public function getPendingRequests($userId) {
        // Requests sent TO this user
        return $this->db->fetchAll("
            SELECT f.id as friendship_id, u.id, u.name, u.email, u.avatar, f.created_at
            FROM friendships f
            JOIN users u ON f.user_id = u.id
            WHERE f.friend_id = ? AND f.status = 'pending'
            ORDER BY f.created_at DESC
        ", [$userId]);
    }
    
    public function getSentRequests($userId) {
        // Requests sent BY this user
        return $this->db->fetchAll("
            SELECT f.id as friendship_id, u.id, u.name, u.email, u.avatar, f.created_at
            FROM friendships f
            JOIN users u ON f.friend_id = u.id
            WHERE f.user_id = ? AND f.status = 'pending'
            ORDER BY f.created_at DESC
        ", [$userId]);
    }
    
    public function areFriends($userId, $friendId) {
        $result = $this->db->fetchOne(
            "SELECT id FROM friendships 
            WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
            AND status = 'accepted'",
            [$userId, $friendId, $friendId, $userId]
        );
        
        return $result !== false;
    }
}

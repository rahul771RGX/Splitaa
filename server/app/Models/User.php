<?php

require_once __DIR__ . '/../../config/database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function findById($id) {
        return $this->db->fetchOne(
            "SELECT id, name, email, phone, avatar, created_at, updated_at FROM users WHERE id = ?",
            [$id]
        );
    }
    
    public function findByEmail($email) {
        return $this->db->fetchOne(
            "SELECT * FROM users WHERE email = ?",
            [$email]
        );
    }
    
    public function create($data) {
        $this->db->execute(
            "INSERT INTO users (name, email, password, phone, avatar) VALUES (?, ?, ?, ?, ?)",
            [
                $data['name'],
                $data['email'],
                $data['password'],
                $data['phone'] ?? null,
                $data['avatar'] ?? null
            ]
        );
        
        return $this->findById($this->db->lastInsertId());
    }
    
    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            if (in_array($key, ['name', 'email', 'phone', 'avatar'])) {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }
        
        if (empty($fields)) {
            return false;
        }
        
        $values[] = $id;
        
        $this->db->execute(
            "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?",
            $values
        );
        
        return $this->findById($id);
    }
    
    public function delete($id) {
        return $this->db->execute("DELETE FROM users WHERE id = ?", [$id]);
    }
    
    public function getFriends($userId) {
        return $this->db->fetchAll("
            SELECT u.id, u.name, u.email, u.phone, u.avatar
            FROM friendships f
            JOIN users u ON (
                CASE 
                    WHEN f.user_id = ? THEN f.friend_id = u.id
                    ELSE f.user_id = u.id
                END
            )
            WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
            ORDER BY u.name
        ", [$userId, $userId, $userId]);
    }
    
    public function search($query) {
        return $this->db->fetchAll(
            "SELECT id, name, email, avatar FROM users 
            WHERE name LIKE ? OR email LIKE ? 
            LIMIT 10",
            ["%$query%", "%$query%"]
        );
    }
}

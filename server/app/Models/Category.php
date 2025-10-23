<?php

require_once __DIR__ . '/../../config/database.php';

class Category {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function findById($id) {
        return $this->db->fetchOne(
            "SELECT * FROM categories WHERE id = ?",
            [$id]
        );
    }
    
    public function all() {
        return $this->db->fetchAll(
            "SELECT * FROM categories ORDER BY name"
        );
    }
    
    public function create($name, $icon = null) {
        $this->db->execute(
            "INSERT INTO categories (name, icon) VALUES (?, ?)",
            [$name, $icon]
        );
        
        return $this->findById($this->db->lastInsertId());
    }
    
    public function update($id, $name, $icon = null) {
        $this->db->execute(
            "UPDATE categories SET name = ?, icon = ? WHERE id = ?",
            [$name, $icon, $id]
        );
        
        return $this->findById($id);
    }
    
    public function delete($id) {
        return $this->db->execute("DELETE FROM categories WHERE id = ?", [$id]);
    }
}

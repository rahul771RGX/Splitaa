<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../Models/Expense.php';
require_once __DIR__ . '/../Models/Group.php';

class ExpenseController {
    private $expenseModel;
    private $groupModel;
    
    public function __construct() {
        $this->expenseModel = new Expense();
        $this->groupModel = new Group();
    }
    
    public function index() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $expenses = $this->expenseModel->findByUser($userId);
        
        Response::success($expenses);
    }
    
    public function store() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (!isset($data['description']) || !isset($data['amount'])) {
            Response::error('Description and amount are required', 400);
        }
        
        if (!isset($data['group_id'])) {
            Response::error('Group ID is required', 400);
        }
        
        // Prepare splits
        $splits = [];
        if (isset($data['splits']) && is_array($data['splits'])) {
            $splits = $data['splits'];
        } elseif (isset($data['splitBetween']) && is_array($data['splitBetween'])) {
            // Support old format
            $splitAmount = $data['amount'] / count($data['splitBetween']);
            foreach ($data['splitBetween'] as $splitUserId) {
                $splits[] = [
                    'user_id' => $splitUserId,
                    'amount' => $splitAmount
                ];
            }
        }
        
        // Get category_id from category name if provided
        $categoryId = null;
        if (isset($data['category'])) {
            // For now, store category as string in notes or add category mapping
            // You can enhance this by creating a categories lookup
        }
        
        // Create expense
        $expense = $this->expenseModel->create([
            'description' => $data['description'],
            'amount' => $data['amount'],
            'paid_by' => $data['paid_by'] ?? $userId,
            'category_id' => $data['category_id'] ?? $categoryId,
            'group_id' => $data['group_id'],
            'date' => $data['date'] ?? date('Y-m-d'),
            'notes' => $data['notes'] ?? null,
            'splits' => $splits
        ]);
        
        // Add category and split_type to response
        $expense['category'] = $data['category'] ?? 'other';
        $expense['split_type'] = $data['split_type'] ?? 'equal';
        
        Response::success($expense, 'Expense created successfully', 201);
    }
    
    public function show($id) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $expense = $this->expenseModel->findById($id);
        
        if (!$expense) {
            Response::notFound('Expense not found');
        }
        
        Response::success($expense);
    }
    
    public function update($id) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Check if expense exists and user has permission
        $expense = $this->expenseModel->findById($id);
        
        if (!$expense) {
            Response::notFound('Expense not found');
        }
        
        // Only group admin/host can edit expenses
        $isAdmin = $this->groupModel->isAdmin($expense['group_id'], $userId);
        
        if (!$isAdmin) {
            Response::error('Only the group host can edit expenses', 403);
        }
        
        // Validation
        if (!isset($data['description']) || !isset($data['amount'])) {
            Response::error('Description and amount are required', 400);
        }
        
        // Prepare splits if provided
        $splits = [];
        if (isset($data['split_type']) && $data['split_type'] === 'equal' && isset($data['splits'])) {
            $splits = $data['splits'];
        } elseif (isset($data['splits'])) {
            $splits = $data['splits'];
        }
        
        // Update expense
        $updatedExpense = $this->expenseModel->update($id, [
            'description' => $data['description'],
            'amount' => $data['amount'],
            'category' => $data['category'] ?? $expense['category'],
            'split_type' => $data['split_type'] ?? $expense['split_type'],
            'paid_by' => $data['paid_by'] ?? $expense['paid_by'],
            'splits' => $splits
        ]);
        
        Response::success($updatedExpense, 'Expense updated successfully');
    }
    
    public function delete($id) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if expense belongs to user or user is admin
        $expense = $this->expenseModel->findById($id);
        
        if (!$expense) {
            Response::error('Expense not found', 404);
        }
        
        // Only group admin/host can delete expenses
        $isAdmin = $this->groupModel->isAdmin($expense['group_id'], $userId);
        
        if (!$isAdmin) {
            Response::error('Only the group host can delete expenses', 403);
        }
        
        $this->expenseModel->delete($id);
        
        Response::success(null, 'Expense deleted successfully');
    }
}

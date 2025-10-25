<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../Models/Settlement.php';
require_once __DIR__ . '/../Models/Expense.php';
require_once __DIR__ . '/../Models/User.php';

class SettlementController {
    private $settlementModel;
    private $expenseModel;
    private $userModel;
    
    public function __construct() {
        $this->settlementModel = new Settlement();
        $this->expenseModel = new Expense();
        $this->userModel = new User();
    }
    
    public function index() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $settlements = $this->settlementModel->findByUser($userId);
        
        Response::success($settlements);
    }
    
    public function store() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (!isset($data['toUserId']) || !isset($data['amount'])) {
            Response::error('To user ID and amount are required', 400);
        }
        
        if ($data['amount'] <= 0) {
            Response::error('Amount must be greater than 0', 400);
        }
        
        // Create settlement
        $settlement = $this->settlementModel->create([
            'from_user_id' => $userId,
            'to_user_id' => $data['toUserId'],
            'amount' => $data['amount'],
            'payment_method' => $data['paymentMethod'] ?? 'upi',
            'notes' => $data['notes'] ?? null,
            'group_id' => $data['groupId'] ?? null
        ]);
        
        Response::success($settlement, 'Settlement recorded successfully', 201);
    }
    
    public function calculateBalances() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $allUsers = $this->userModel->getFriends($userId);
        
        $balances = [];
        
        foreach ($allUsers as $user) {
            // Get expense balance
            $expenseBalance = $this->expenseModel->getUserBalance($userId, $user['id']);
            
            // Get settlement totals
            $settledByMe = $this->settlementModel->getTotalSettled($userId, $user['id']);
            $settledToMe = $this->settlementModel->getTotalSettled($user['id'], $userId);
            
            // Calculate net balance
            $netBalance = $expenseBalance['balance'] + ($settledToMe - $settledByMe);
            
            if (abs($netBalance) > 0.01) {
                $balances[] = [
                    'userId' => $user['id'],
                    'userName' => $user['name'],
                    'userEmail' => $user['email'],
                    'userAvatar' => $user['avatar'] ?? null,
                    'balance' => round($netBalance, 2),
                    'youOwe' => $netBalance < 0 ? abs($netBalance) : 0,
                    'owesYou' => $netBalance > 0 ? $netBalance : 0
                ];
            }
        }
        
        Response::success($balances);
    }
}

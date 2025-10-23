<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../Models/Friendship.php';
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Expense.php';
require_once __DIR__ . '/../Models/Settlement.php';

class FriendController {
    private $friendshipModel;
    private $userModel;
    private $expenseModel;
    private $settlementModel;
    
    public function __construct() {
        $this->friendshipModel = new Friendship();
        $this->userModel = new User();
        $this->expenseModel = new Expense();
        $this->settlementModel = new Settlement();
    }
    
    public function index() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $friends = $this->friendshipModel->getFriends($userId);
        
        Response::success($friends);
    }
    
    public function sendRequest() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email'])) {
            Response::error('Friend email is required', 400);
        }
        
        // Find user by email
        $friend = $this->userModel->findByEmail($data['email']);
        
        if (!$friend) {
            Response::error('User not found', 404);
        }
        
        if ($friend['id'] == $userId) {
            Response::error('You cannot add yourself as a friend', 400);
        }
        
        // Check if friendship already exists
        $existing = $this->friendshipModel->findByUsers($userId, $friend['id']);
        
        if ($existing) {
            Response::error('Friend request already exists', 409);
        }
        
        // Create friendship (auto-accepted)
        $friendship = $this->friendshipModel->create($userId, $friend['id'], 'accepted');
        
        if ($friendship) {
            Response::success(null, 'Friend added successfully', 201);
        } else {
            Response::error('Failed to add friend', 500);
        }
    }
    
    public function balances() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Get all friends
        $friends = $this->friendshipModel->getFriends($userId);
        
        // Calculate balance with each friend
        foreach ($friends as &$friend) {
            $balance = $this->expenseModel->getUserBalance($userId, $friend['id']);
            
            // Get settlements
            $settledByMe = $this->settlementModel->getTotalSettled($userId, $friend['id']);
            $settledToMe = $this->settlementModel->getTotalSettled($friend['id'], $userId);
            
            $netBalance = $balance['balance'] + ($settledToMe - $settledByMe);
            
            $friend['balance'] = round($netBalance, 2);
            $friend['youOwe'] = $netBalance < 0 ? abs($netBalance) : 0;
            $friend['owesYou'] = $netBalance > 0 ? $netBalance : 0;
        }
        
        Response::success($friends);
    }
}

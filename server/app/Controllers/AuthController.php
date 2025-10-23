<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../Models/User.php';

class AuthController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new User();
    }
    
    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            Response::error('Name, email and password are required', 400);
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }
        
        if (strlen($data['password']) < 6) {
            Response::error('Password must be at least 6 characters', 400);
        }
        
        // Check if user exists
        $existingUser = $this->userModel->findByEmail($data['email']);
        
        if ($existingUser) {
            Response::error('Email already registered', 409);
        }
        
        // Create user
        $user = $this->userModel->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Auth::hashPassword($data['password']),
            'phone' => $data['phone'] ?? null
        ]);
        
        $userId = $user['id'];
        
        // Generate token
        $token = Auth::generateToken($userId);
        
        Response::success([
            'user' => $user,
            'token' => $token
        ], 'Registration successful', 201);
    }
    
    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (!isset($data['email']) || !isset($data['password'])) {
            Response::error('Email and password are required', 400);
        }
        
        // Get user
        $user = $this->userModel->findByEmail($data['email']);
        
        if (!$user) {
            Response::error('Invalid credentials', 401);
        }
        
        // Verify password
        if (!Auth::verifyPassword($data['password'], $user['password'])) {
            Response::error('Invalid credentials', 401);
        }
        
        // Remove password from response
        unset($user['password']);
        
        // Generate token
        $token = Auth::generateToken($user['id']);
        
        Response::success([
            'user' => $user,
            'token' => $token
        ], 'Login successful');
    }
    
    public function me() {
        $userId = Auth::getUserIdFromToken();
        
        if (!$userId) {
            Response::unauthorized();
        }
        
        $user = $this->userModel->findById($userId);
        
        if (!$user) {
            Response::notFound('User not found');
        }
        
        Response::success($user);
    }
    
    public function syncClerkUser() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (!isset($data['clerkId']) || !isset($data['email'])) {
            Response::error('Clerk ID and email are required', 400);
        }
        
        // Check if user exists by email
        $existingUser = $this->userModel->findByEmail($data['email']);
        
        if ($existingUser) {
            // Update avatar if provided
            if (isset($data['avatar']) && $data['avatar']) {
                $this->userModel->update($existingUser['id'], ['avatar' => $data['avatar']]);
            }
            
            // Generate token
            $token = Auth::generateToken($existingUser['id']);
            
            Response::success([
                'user' => $existingUser,
                'token' => $token
            ], 'User synced successfully');
            return;
        }
        
        // Create new user from Clerk data
        $user = $this->userModel->create([
            'name' => $data['name'] ?? 'User',
            'email' => $data['email'],
            'password' => Auth::hashPassword('clerk_oauth_' . $data['clerkId']),
            'avatar' => $data['avatar'] ?? null
        ]);
        
        $userId = $user['id'];
        
        // Generate token
        $token = Auth::generateToken($userId);
        
        Response::success([
            'user' => $user,
            'token' => $token,
            'is_new' => true
        ], 'User created and synced successfully', 201);
    }
}

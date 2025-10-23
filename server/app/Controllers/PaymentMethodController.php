<?php

require_once __DIR__ . '/../Models/PaymentMethod.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../config/database.php';

class PaymentMethodController {
    private $paymentMethod;
    private $conn;
    
    public function __construct() {
        $db = Database::getInstance();
        $this->conn = $db->getConnection();
        $this->paymentMethod = new PaymentMethod($this->conn);
    }
    
    // GET /api/payment-methods - Get all payment methods for current user
    public function index() {
        $user = Auth::getUser();
        
        if (!$user) {
            Response::unauthorized('Not authenticated');
            return;
        }
        
        $methods = $this->paymentMethod->getByUserId($user['id']);
        Response::success($methods, 'Payment methods retrieved successfully');
    }
    
    // GET /api/users/:userId/payment-methods - Get payment methods for a specific user (for paying them)
    public function getUserPaymentMethods($userId) {
        $currentUser = Auth::getUser();
        
        if (!$currentUser) {
            Response::unauthorized('Not authenticated');
            return;
        }
        
        $methods = $this->paymentMethod->getByUserId($userId);
        Response::success($methods, 'User payment methods retrieved successfully');
    }
    
    // POST /api/payment-methods - Create a new payment method
    public function store() {
        try {
            $user = Auth::getUser();
            
            error_log("Payment method store - User: " . json_encode($user));
            
            if (!$user) {
                Response::unauthorized('Not authenticated');
                return;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            error_log("Payment method store - Data: " . json_encode($data));
            
            // Validate required fields
            if (!isset($data['type']) || !in_array($data['type'], ['upi', 'bank'])) {
                Response::error('Invalid payment method type', 400);
                return;
            }
            
            if ($data['type'] === 'upi' && empty($data['upi_id'])) {
                Response::error('UPI ID is required', 400);
                return;
            }
            
            if ($data['type'] === 'bank' && (empty($data['bank_name']) || empty($data['account_number']) || empty($data['ifsc_code']))) {
                Response::error('Bank details are required', 400);
                return;
            }
            
            // Prepare data
            $methodData = [
                'user_id' => $user['id'],
                'type' => $data['type'],
                'upi_id' => $data['upi_id'] ?? null,
                'bank_name' => $data['bank_name'] ?? null,
                'account_number' => $data['account_number'] ?? null,
                'ifsc_code' => $data['ifsc_code'] ?? null,
                'is_primary' => $data['is_primary'] ?? 0
            ];
            
            error_log("Payment method store - Method data: " . json_encode($methodData));
            
            $id = $this->paymentMethod->create($methodData);
            
            error_log("Payment method store - Created ID: " . $id);
            
            if ($id) {
                try {
                    $methods = $this->paymentMethod->getByUserId($user['id']);
                    error_log("Payment method store - Fetched methods: " . json_encode($methods));
                    Response::success($methods, 'Payment method added successfully');
                } catch (Exception $e) {
                    error_log("Payment method store - Error fetching methods: " . $e->getMessage());
                    // Still send success since the method was created
                    Response::success(['id' => $id], 'Payment method added successfully');
                }
            } else {
                Response::error('Failed to add payment method', 500);
            }
        } catch (Exception $e) {
            error_log("Payment method store - Exception: " . $e->getMessage());
            Response::error('Error adding payment method: ' . $e->getMessage(), 500);
        }
    }
    
    // PUT /api/payment-methods/:id - Update payment method
    public function update($id) {
        $user = Auth::getUser();
        
        if (!$user) {
            Response::unauthorized('Not authenticated');
            return;
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validate
        if (!isset($data['type']) || !in_array($data['type'], ['upi', 'bank'])) {
            Response::error('Invalid payment method type', 400);
            return;
        }
        
        $methodData = [
            'type' => $data['type'],
            'upi_id' => $data['upi_id'] ?? null,
            'bank_name' => $data['bank_name'] ?? null,
            'account_number' => $data['account_number'] ?? null,
            'ifsc_code' => $data['ifsc_code'] ?? null,
            'is_primary' => $data['is_primary'] ?? 0
        ];
        
        if ($this->paymentMethod->update($id, $user['id'], $methodData)) {
            $methods = $this->paymentMethod->getByUserId($user['id']);
            Response::success($methods, 'Payment method updated successfully');
        } else {
            Response::error('Failed to update payment method', 500);
        }
    }
    
    // DELETE /api/payment-methods/:id - Delete payment method
    public function delete($id) {
        $user = Auth::getUser();
        
        if (!$user) {
            Response::unauthorized('Not authenticated');
            return;
        }
        
        if ($this->paymentMethod->delete($id, $user['id'])) {
            Response::success(null, 'Payment method deleted successfully');
        } else {
            Response::error('Failed to delete payment method', 500);
        }
    }
    
    // PUT /api/payment-methods/:id/set-primary - Set as primary payment method
    public function setPrimary($id) {
        $user = Auth::getUser();
        
        if (!$user) {
            Response::unauthorized('Not authenticated');
            return;
        }
        
        if ($this->paymentMethod->setPrimary($id, $user['id'])) {
            $methods = $this->paymentMethod->getByUserId($user['id']);
            Response::success($methods, 'Primary payment method updated');
        } else {
            Response::error('Failed to set primary payment method', 500);
        }
    }
}

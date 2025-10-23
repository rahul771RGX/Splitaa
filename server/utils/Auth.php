<?php

class Auth {
    public static function generateToken($user_id) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $user_id,
            'exp' => time() + JWT_EXPIRY
        ]);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    public static function validateToken($token) {
        if (!$token) {
            return false;
        }
        
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }
        
        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signatureProvided = $tokenParts[2];
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if ($base64UrlSignature !== $signatureProvided) {
            return false;
        }
        
        $payloadArray = json_decode($payload, true);
        if (isset($payloadArray['exp']) && $payloadArray['exp'] < time()) {
            return false;
        }
        
        return $payloadArray;
    }
    
    public static function getUserIdFromToken() {
        $headers = getallheaders();
        $token = null;
        
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
        }
        
        // Check if it's a Clerk token (format: clerk_user_xxxxx)
        if ($token && strpos($token, 'clerk_user_') === 0) {
            // For Clerk users, extract the Clerk ID and find/create user
            $clerkId = $token; // The token IS the clerk ID
            
            // Try to find user by clerk_id (we'll need to add this field)
            // For now, return a special ID that controllers can handle
            return $clerkId;
        }
        
        // Regular JWT token validation
        $payload = self::validateToken($token);
        return $payload ? $payload['user_id'] : null;
    }
    
    public static function getOrCreateClerkUser($clerkId, $userData = []) {
        $db = Database::getInstance()->getConnection();
        
        // Try to find existing user by email
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$userData['email'] ?? '']);
        $user = $stmt->fetch();
        
        if ($user) {
            return $user['id'];
        }
        
        // Create new user for Clerk
        $stmt = $db->prepare("
            INSERT INTO users (name, email, password, avatar) 
            VALUES (?, ?, ?, ?)
        ");
        
        $dummyPassword = password_hash('clerk_oauth_' . $clerkId, PASSWORD_BCRYPT);
        
        $stmt->execute([
            $userData['name'] ?? 'Clerk User',
            $userData['email'] ?? 'clerk_' . substr($clerkId, 0, 10) . '@example.com',
            $dummyPassword,
            $userData['avatar'] ?? null
        ]);
        
        return $db->lastInsertId();
    }
    
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
    
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
}

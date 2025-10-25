<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../Models/Group.php';
require_once __DIR__ . '/../Models/User.php';

class GroupController {
    private $groupModel;
    private $userModel;
    
    public function __construct() {
        $this->groupModel = new Group();
        $this->userModel = new User();
    }
    
    public function index() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $groups = $this->groupModel->findByUser($userId);
        
        Response::success($groups);
    }
    
    public function store() {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validation
        if (!isset($data['name'])) {
            Response::error('Group name is required', 400);
        }
        
        // Create group
        $group = $this->groupModel->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'created_by' => $userId
        ]);
        
        // Add other members if provided
        if (isset($data['members']) && is_array($data['members'])) {
            foreach ($data['members'] as $memberId) {
                if ($memberId != $userId) {
                    $this->groupModel->addMember($group['id'], $memberId);
                }
            }
            // Refresh group to get updated member list
            $group = $this->groupModel->findById($group['id']);
        }
        
        Response::success($group, 'Group created successfully', 201);
    }
    
    public function show($id) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if user is member
        if (!$this->groupModel->isMember($id, $userId)) {
            Response::error('You are not a member of this group', 403);
        }
        
        $group = $this->groupModel->findById($id);
        
        if (!$group) {
            Response::notFound('Group not found');
        }
        
        // Add expenses to group
        $group['expenses'] = $this->groupModel->getExpenses($id);
        
        Response::success($group);
    }
    
    public function addMember($groupId) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if user is admin
        if (!$this->groupModel->isAdmin($groupId, $userId)) {
            Response::error('Only admins can add members', 403);
        }
        
        $data = json_decode(file_get_contents('php://input'), true);
        
        $newUserId = null;
        
        // Support both userId and email
        if (isset($data['email'])) {
            // Find user by email
            $user = $this->userModel->findByEmail($data['email']);
            if (!$user) {
                Response::error('User with this email not found', 404);
            }
            $newUserId = $user['id'];
        } elseif (isset($data['userId'])) {
            $newUserId = $data['userId'];
        } else {
            Response::error('User ID or email is required', 400);
        }
        
        // Check if already member
        if ($this->groupModel->isMember($groupId, $newUserId)) {
            Response::error('User is already a member', 409);
        }
        
        $result = $this->groupModel->addMember($groupId, $newUserId);
        
        if ($result) {
            Response::success(null, 'Member added successfully');
        } else {
            Response::error('Failed to add member', 500);
        }
    }
    
    public function getExpenses($groupId) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if user is member
        if (!$this->groupModel->isMember($groupId, $userId)) {
            Response::error('You are not a member of this group', 403);
        }
        
        $expenses = $this->groupModel->getExpenses($groupId);
        
        Response::success($expenses);
    }
    
    public function getMembers($groupId) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if user is member
        if (!$this->groupModel->isMember($groupId, $userId)) {
            Response::error('You are not a member of this group', 403);
        }
        
        $members = $this->groupModel->getMembers($groupId);
        
        Response::success($members);
    }
    
    public function removeMember($groupId, $memberId) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if user is admin
        if (!$this->groupModel->isAdmin($groupId, $userId)) {
            Response::error('Only admins can remove members', 403);
        }
        
        // Can't remove the creator
        $group = $this->groupModel->findById($groupId);
        if ($group['created_by'] == $memberId) {
            Response::error('Cannot remove the group creator', 403);
        }
        
        $result = $this->groupModel->removeMember($groupId, $memberId);
        
        if ($result) {
            Response::success(null, 'Member removed successfully');
        } else {
            Response::error('Failed to remove member', 500);
        }
    }
    
    public function delete($id) {
        $userId = Auth::getUserIdFromToken();
        if (!$userId) Response::unauthorized();
        
        // Check if group exists
        $group = $this->groupModel->findById($id);
        if (!$group) {
            Response::notFound('Group not found');
        }
        
        // Only group admin/host can delete the group
        if (!$this->groupModel->isAdmin($id, $userId)) {
            Response::error('Only the group host can delete this group', 403);
        }
        
        // Delete the group (will cascade delete members and expenses)
        $result = $this->groupModel->delete($id);
        
        if ($result) {
            Response::success(null, 'Group deleted successfully');
        } else {
            Response::error('Failed to delete group', 500);
        }
    }
}

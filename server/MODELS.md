# Models Documentation

## Overview
Model classes provide a clean abstraction layer for database operations. Each model corresponds to a database table and contains methods for CRUD operations and business logic.

## Available Models

### 1. User Model (`app/Models/User.php`)

Handles user-related database operations.

#### Methods:

**`findById($id)`**
- Returns user by ID (without password)
- Returns: User array or false

**`findByEmail($email)`**
- Returns user by email (includes password for authentication)
- Returns: User array or false

**`create($data)`**
- Creates a new user
- Parameters: `['name', 'email', 'password', 'phone', 'avatar']`
- Returns: Created user array

**`update($id, $data)`**
- Updates user information
- Parameters: User ID and array of fields to update
- Returns: Updated user array

**`delete($id)`**
- Deletes a user
- Returns: Boolean

**`getFriends($userId)`**
- Gets all accepted friends for a user
- Returns: Array of friend objects

**`search($query)`**
- Searches users by name or email
- Returns: Array of matching users (max 10)

#### Example Usage:
```php
$userModel = new User();

// Find user
$user = $userModel->findById(1);

// Create user
$newUser = $userModel->create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'password' => password_hash('password', PASSWORD_BCRYPT),
    'phone' => '1234567890'
]);

// Get friends
$friends = $userModel->getFriends(1);
```

---

### 2. Expense Model (`app/Models/Expense.php`)

Manages expense records and calculations.

#### Methods:

**`findById($id)`**
- Returns expense with splits and user details
- Returns: Expense array with 'splits' key

**`findByUser($userId)`**
- Gets all expenses involving a user (paid or split)
- Returns: Array of expenses with splits

**`findByGroup($groupId)`**
- Gets all expenses for a specific group
- Returns: Array of expenses with splits

**`create($data)`**
- Creates new expense with splits
- Parameters: `['description', 'amount', 'paid_by', 'category_id', 'group_id', 'date', 'notes', 'splits']`
- Returns: Created expense with splits

**`update($id, $data)`**
- Updates expense details
- Returns: Updated expense

**`delete($id)`**
- Deletes expense (splits deleted automatically)
- Returns: Boolean

**`getSplits($expenseId)`**
- Gets all splits for an expense
- Returns: Array of split objects

**`createSplit($expenseId, $userId, $amount)`**
- Creates a split entry
- Returns: Boolean

**`getUserBalance($userId, $friendId = null)`**
- Calculates balance for user
- If friendId provided: balance with that friend
- If null: total balance with everyone
- Returns: Balance array

#### Example Usage:
```php
$expenseModel = new Expense();

// Create expense with splits
$expense = $expenseModel->create([
    'description' => 'Dinner',
    'amount' => 1000.00,
    'paid_by' => 1,
    'category_id' => 1,
    'date' => '2025-10-20',
    'splits' => [
        ['user_id' => 1, 'amount' => 250],
        ['user_id' => 2, 'amount' => 250],
        ['user_id' => 3, 'amount' => 250],
        ['user_id' => 4, 'amount' => 250]
    ]
]);

// Get user expenses
$expenses = $expenseModel->findByUser(1);

// Calculate balance
$balance = $expenseModel->getUserBalance(1, 2);
```

---

### 3. Group Model (`app/Models/Group.php`)

Manages group operations and membership.

#### Methods:

**`findById($id)`**
- Returns group with member count and stats
- Returns: Group array with 'members' key

**`findByUser($userId)`**
- Gets all groups where user is a member
- Returns: Array of groups with members

**`create($data)`**
- Creates new group (creator added as admin automatically)
- Parameters: `['name', 'description', 'created_by', 'image']`
- Returns: Created group with members

**`update($id, $data)`**
- Updates group details
- Returns: Updated group

**`delete($id)`**
- Deletes group (members and expenses deleted automatically)
- Returns: Boolean

**`getMembers($groupId)`**
- Gets all members of a group
- Returns: Array of member objects with roles

**`addMember($groupId, $userId, $role = 'member')`**
- Adds user to group
- Returns: Boolean

**`removeMember($groupId, $userId)`**
- Removes user from group
- Returns: Boolean

**`isMember($groupId, $userId)`**
- Checks if user is member of group
- Returns: Boolean

**`isAdmin($groupId, $userId)`**
- Checks if user is admin of group
- Returns: Boolean

**`getExpenses($groupId)`**
- Gets all expenses for the group
- Returns: Array of expenses

#### Example Usage:
```php
$groupModel = new Group();

// Create group
$group = $groupModel->create([
    'name' => 'Goa Trip',
    'description' => 'Trip expenses',
    'created_by' => 1
]);

// Add member
$groupModel->addMember($group['id'], 2, 'member');

// Check permissions
if ($groupModel->isAdmin($groupId, $userId)) {
    // Allow admin actions
}

// Get group expenses
$expenses = $groupModel->getExpenses($groupId);
```

---

### 4. Friendship Model (`app/Models/Friendship.php`)

Manages friend relationships.

#### Methods:

**`findById($id)`**
- Returns friendship record with user details
- Returns: Friendship array

**`findByUsers($userId, $friendId)`**
- Finds friendship between two users (bidirectional)
- Returns: Friendship array or false

**`create($userId, $friendId, $status = 'accepted')`**
- Creates friendship (auto-accepts by default)
- Returns: Created friendship or false if exists

**`updateStatus($id, $status)`**
- Updates friendship status ('pending', 'accepted', 'rejected')
- Returns: Updated friendship

**`delete($id)`**
- Deletes friendship
- Returns: Boolean

**`getFriends($userId, $status = 'accepted')`**
- Gets all friends with specific status
- Returns: Array of friend objects

**`getPendingRequests($userId)`**
- Gets friend requests sent TO this user
- Returns: Array of pending requests

**`getSentRequests($userId)`**
- Gets friend requests sent BY this user
- Returns: Array of sent requests

**`areFriends($userId, $friendId)`**
- Checks if two users are friends
- Returns: Boolean

#### Example Usage:
```php
$friendshipModel = new Friendship();

// Add friend
$friendship = $friendshipModel->create(1, 2, 'accepted');

// Get all friends
$friends = $friendshipModel->getFriends(1);

// Check if friends
if ($friendshipModel->areFriends(1, 2)) {
    // They are friends
}

// Get pending requests
$requests = $friendshipModel->getPendingRequests(1);
```

---

### 5. Settlement Model (`app/Models/Settlement.php`)

Manages payment records between users.

#### Methods:

**`findById($id)`**
- Returns settlement with user details
- Returns: Settlement array

**`findByUser($userId)`**
- Gets all settlements involving user
- Returns: Array of settlements

**`findByGroup($groupId)`**
- Gets all settlements for a group
- Returns: Array of settlements

**`create($data)`**
- Records a new settlement/payment
- Parameters: `['from_user_id', 'to_user_id', 'amount', 'payment_method', 'notes', 'group_id']`
- Returns: Created settlement

**`delete($id)`**
- Deletes settlement record
- Returns: Boolean

**`getSettlementsBetween($userId1, $userId2)`**
- Gets all settlements between two users
- Returns: Array of settlements

**`getTotalSettled($fromUserId, $toUserId)`**
- Calculates total amount settled from one user to another
- Returns: Decimal amount

#### Example Usage:
```php
$settlementModel = new Settlement();

// Record payment
$settlement = $settlementModel->create([
    'from_user_id' => 1,
    'to_user_id' => 2,
    'amount' => 500.00,
    'payment_method' => 'upi',
    'notes' => 'Dinner payment'
]);

// Get user settlements
$settlements = $settlementModel->findByUser(1);

// Calculate total settled
$total = $settlementModel->getTotalSettled(1, 2);
```

---

### 6. Category Model (`app/Models/Category.php`)

Manages expense categories.

#### Methods:

**`findById($id)`**
- Returns category by ID
- Returns: Category array

**`all()`**
- Gets all categories
- Returns: Array of categories

**`create($name, $icon = null)`**
- Creates new category
- Returns: Created category

**`update($id, $name, $icon = null)`**
- Updates category
- Returns: Updated category

**`delete($id)`**
- Deletes category
- Returns: Boolean

#### Example Usage:
```php
$categoryModel = new Category();

// Get all categories
$categories = $categoryModel->all();

// Create category
$category = $categoryModel->create('Travel', '✈️');
```

---

## Using Models in Controllers

Controllers should use models instead of direct database queries:

```php
<?php

require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Models/Expense.php';

class MyController {
    private $userModel;
    private $expenseModel;
    
    public function __construct() {
        $this->userModel = new User();
        $this->expenseModel = new Expense();
    }
    
    public function getUserWithExpenses($userId) {
        $user = $this->userModel->findById($userId);
        $expenses = $this->expenseModel->findByUser($userId);
        
        return [
            'user' => $user,
            'expenses' => $expenses
        ];
    }
}
```

## Benefits of Using Models

1. **Code Reusability** - DRY principle, write once use everywhere
2. **Maintainability** - Changes in one place affect all usages
3. **Testability** - Easy to mock and test
4. **Cleaner Controllers** - Controllers focus on HTTP logic, models handle data
5. **Business Logic** - Models contain data-related business rules
6. **Type Safety** - Consistent data structures

## Best Practices

1. Always use models in controllers instead of direct DB queries
2. Keep business logic in models
3. Return consistent data structures
4. Handle errors gracefully
5. Use transactions for complex operations
6. Add indexes for frequently queried fields
7. Document complex queries

---

**Models make your backend faster, cleaner, and easier to maintain!** 🚀

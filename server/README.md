# Expense Splitter API - PHP Backend

Fast and compatible PHP backend for the Expense Splitter application.

## 🚀 Features

- **RESTful API** with JSON responses
- **JWT Authentication** for secure API access
- **MySQL Database** with optimized queries
- **CORS Enabled** for React frontend
- **Clean Architecture** with Controllers, Models, and Routes
- **Balance Calculations** with settlement optimization
- **Group Management** with multi-user support

## 📋 Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache with mod_rewrite enabled (or any PHP server)
- XAMPP/WAMP/Laragon (for Windows) or LAMP (for Linux)

## 🔧 Installation

### Step 1: Setup Database

1. Open **phpMyAdmin** or MySQL command line
2. Run the SQL schema file:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or import `database/schema.sql` via phpMyAdmin

3. Update database credentials in `config/database.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'expense_splitter');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   ```

### Step 2: Configure Web Server

#### Option A: Using XAMPP/WAMP (Windows)

1. Copy the `server` folder to your web root:
   - XAMPP: `C:\xampp\htdocs\expense-splitter-api`
   - WAMP: `C:\wamp64\www\expense-splitter-api`

2. Make sure Apache is running

3. Access the API at:
   ```
   http://localhost/expense-splitter-api/public
   ```

#### Option B: Using PHP Built-in Server (Development Only)

```bash
cd server/public
php -S localhost:8000
```

Access at: `http://localhost:8000`

### Step 3: Configure Frontend

Update your React app's API URL in `client/src/services/api.js`:

```javascript
const API_URL = 'http://localhost/expense-splitter-api/public';
// OR for built-in server:
// const API_URL = 'http://localhost:8000';
```

### Step 4: Test the API

Visit: `http://localhost:8000/health` or `http://localhost/expense-splitter-api/public/health`

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-20 12:00:00"
  }
}
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

#### Register Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

#### Login Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Expenses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/expenses` | Get all user expenses | Yes |
| GET | `/api/expenses/{id}` | Get specific expense | Yes |
| POST | `/api/expenses` | Create new expense | Yes |
| DELETE | `/api/expenses/{id}` | Delete expense | Yes |

#### Create Expense Request:
```json
{
  "description": "Dinner at restaurant",
  "amount": 1500.00,
  "paidBy": 1,
  "categoryId": 1,
  "groupId": 1,
  "date": "2025-10-20",
  "splitBetween": [1, 2, 3, 4],
  "notes": "Birthday celebration"
}
```

### Groups

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/groups` | Get all user groups | Yes |
| GET | `/api/groups/{id}` | Get specific group | Yes |
| POST | `/api/groups` | Create new group | Yes |
| POST | `/api/groups/{id}/add-member` | Add member to group | Yes |

#### Create Group Request:
```json
{
  "name": "Goa Trip 2025",
  "description": "Trip expenses",
  "members": [2, 3, 4]
}
```

### Friends

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/friends` | Get all friends | Yes |
| POST | `/api/friends` | Add friend by email | Yes |
| GET | `/api/friends/balances` | Get balances with friends | Yes |

#### Add Friend Request:
```json
{
  "email": "friend@example.com"
}
```

### Settlements

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/settlements` | Get all settlements | Yes |
| POST | `/api/settlements` | Record new settlement | Yes |
| GET | `/api/settlements/calculate` | Calculate balances | Yes |

#### Record Settlement Request:
```json
{
  "toUserId": 2,
  "amount": 500.00,
  "paymentMethod": "upi",
  "notes": "Payment for dinner",
  "groupId": 1
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Example using fetch:
```javascript
fetch('http://localhost:8000/api/expenses', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## 📁 Project Structure

```
server/
├── app/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── ExpenseController.php
│   │   ├── GroupController.php
│   │   ├── FriendController.php
│   │   └── SettlementController.php
│   ├── Models/
│   └── Middleware/
├── config/
│   └── database.php
├── database/
│   └── schema.sql
├── public/
│   ├── index.php
│   └── .htaccess
├── routes/
│   └── api.php
└── utils/
    ├── Response.php
    └── Auth.php
```

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, make sure:
1. Your API URL in React matches the backend URL
2. Apache mod_headers is enabled
3. CORS headers are set in `public/index.php`

### Database Connection Failed
1. Check MySQL is running
2. Verify credentials in `config/database.php`
3. Ensure database `expense_splitter` exists

### 404 Errors
1. Ensure `.htaccess` file exists in `public/` folder
2. Enable `mod_rewrite` in Apache
3. Check your base path in `public/index.php`

### Token Issues
1. Make sure JWT_SECRET is set in `config/database.php`
2. Token expires after 24 hours by default
3. Check Authorization header format: `Bearer <token>`

## 🔄 Test Data

The schema includes 4 test users:
- **Email**: `snk@example.com` | **Password**: `password`
- **Email**: `rahul@example.com` | **Password**: `password`
- **Email**: `saptarshi@example.com` | **Password**: `password`
- **Email**: `soumyajit@example.com` | **Password**: `password`

## 📝 Notes

- Default password hashing uses PHP's `password_hash()` (bcrypt)
- JWT expiry is set to 24 hours (configurable in `config/database.php`)
- All monetary amounts are stored as DECIMAL(10,2)
- Timestamps are automatically managed by MySQL

## 🚀 Next Steps

1. ✅ Database setup complete
2. ✅ API endpoints created
3. 🔄 Update React frontend to use API
4. 🔄 Test all endpoints
5. 🔄 Add error handling
6. 🔄 Deploy to production server

## 📄 License

MIT License

---

**Made with ❤️ for Expense Splitter App**

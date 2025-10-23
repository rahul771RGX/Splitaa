# Expense Splitter API - Quick Start Guide

## Prerequisites
- XAMPP/WAMP installed on Windows
- Or PHP 7.4+ and MySQL 5.7+ installed

## Quick Setup (5 Minutes)

### 1. Database Setup
```bash
# Open MySQL (via phpMyAdmin or command line)
# Import the schema file: database/schema.sql
# This creates the database and tables with test data
```

### 2. Start Server

**Option A: Using XAMPP**
```bash
# Copy server folder to C:\xampp\htdocs\
# Start Apache and MySQL from XAMPP Control Panel
# Visit: http://localhost/server/public/health
```

**Option B: Using PHP Built-in Server (Easiest for development)**
```bash
cd server/public
php -S localhost:8000
# Visit: http://localhost:8000/health
```

### 3. Update React Frontend
Edit `client/src/services/api.js`:
```javascript
const API_URL = 'http://localhost:8000';
```

### 4. Test Login
```bash
# Use test credentials:
Email: snk@example.com
Password: password
```

## API Quick Reference

### Login
```bash
POST http://localhost:8000/api/auth/login
Body: {"email": "snk@example.com", "password": "password"}
```

### Get Expenses (after login)
```bash
GET http://localhost:8000/api/expenses
Header: Authorization: Bearer <your-token>
```

## Common Issues

**"Database connection failed"**
- Start MySQL in XAMPP
- Check credentials in `config/database.php`

**"404 Not Found"**
- Make sure you're accessing `/public` folder
- Or use PHP built-in server

**CORS Error**
- Update FRONTEND_URL in config
- Headers are already set in index.php

---

That's it! Your backend is ready 🚀

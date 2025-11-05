
# Admin Panel Development Guide (Angular 17)

This guide provides step-by-step instructions for building a simple admin dashboard using the latest Angular (Angular 17). The dashboard will show total users and groups, with search functionality—all on a single page.

---

## 1. Project Setup

- **Framework:** Angular 17
- **Directory:** Create a new folder, e.g., `admin-panel/`
- **Initialize Project:**
  - Use Angular CLI: `ng new admin-panel --routing --style=scss`
- **Version Control:** Add to your GitHub repo for CI/CD

---

## 2. Authentication & Access Control

- **Goal:** Only allow access to authorized admin users
- **Approach:**
  - Use JWT authentication (same as main client)
  - On login, store JWT in localStorage
  - Protect dashboard route using Angular route guards
  - Backend should verify JWT and check for admin role

---

## 3. API Integration

- **Base URL:** Use the same backend API as your main client (`/api` endpoints)
- **Endpoints:**
  - `/api/users` (GET: list users)
  - `/api/groups` (GET: list groups)
- **Authentication:**
  - Send JWT in `Authorization: Bearer <token>` header for all requests

---

## 4. Features to Implement (Single Page)

- **Dashboard Page:**
  - Show total users and total groups (fetch counts from API)
  - List users with search/filter
  - List groups with search/filter
  - All data and search on one page (no extra navigation)

---

## 5. UI/UX Guidelines

- **Design:**
  - Match branding/colors with main client for consistency
  - Use responsive layouts (Angular Material recommended)
  - Show loading states, error messages, and success notifications

---

## 6. Example API Service (Angular)

```typescript
// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'https://splitaa-backend-16104559665.asia-south1.run.app/api';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.apiUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getGroups(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.apiUrl}/groups`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
```

---

## 7. References

- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [JWT Auth in Angular](https://jasonwatmore.com/post/2020/07/18/angular-10-jwt-authentication-example-tutorial)

---

## 8. Questions & Support

- For backend API details, see `server/routes/api.php` and controller files
- For client-side integration, see `client/src/services/api.js`
- For help, contact the backend or frontend lead

---

**This guide ensures your admin dashboard will be secure, match your main app, and integrate smoothly with your backend.**

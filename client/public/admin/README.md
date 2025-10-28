# Splitaa Admin Panel (AngularJS)

This is a small, self-contained admin panel built with AngularJS 1.8 for quick local inspection and demos.

Features
- View / create / delete (mock) users, groups and expenses.
- Mock-data by default. Toggle "Use real API" to switch to real API mode and provide an API base URL.

How to run

1. Open the admin UI directly in your browser:

   - Open `admin/index.html` in a modern browser. The UI uses mock data by default so it works without a server.

2. (Recommended) Serve the folder with a static server so the API toggle can call real endpoints.

   From the repository root (Windows cmd.exe):

   ```cmd
   cd client\public\admin
   python -m http.server 8000
   ```

   Then open http://localhost:8000 in your browser.

Using the real API

- Enable the "Use real API" checkbox and set the API base URL (for example `http://localhost:8000` or your PHP server base). The panel will attempt to call endpoints like `/api/users`, `/api/groups`, `/api/expenses`.
- The admin panel is intentionally minimal and does not include authentication. If your API requires auth, you'll need to modify `app.js` (service `AdminApi`) to attach tokens/headers.

Notes & next steps
- If you want this integrated into the existing React `client/` app, we can either embed it as static files under `client/public/admin` or rewrite it in React to match the main app's styling and auth.
- I can also add real API mappings to the `server/` routes, add basic auth, or implement axios fetches with a configured token.

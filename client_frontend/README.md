# Jyoti Customer Query Portal

Separate React + Vite + Tailwind customer-facing query portal, visually aligned with the supplied Admin/Staff portal.

## Run
```bash
npm install
npm run dev
```

## Demo flow
- Login: submit the prefilled demo credentials.
- Dashboard: overview and recent queries.
- My Queries: search/filter and open query detail.
- Raise Query: submit a new query. Demo data is saved in browser localStorage.
- Query Details: customer can add messages/replies.
- Profile / Help & Support screens included.

## Backend integration
This package is intentionally UI-ready and independent. Replace QueryContext localStorage calls with your backend API/service layer when customer APIs are available.

## Customer Registration
New customers can create an account at `/register`.
The form calls `POST /api/customers/register` with name, companyName, email, mobile, password, address and location.
After successful registration the customer is redirected to the login page, where the registered email is pre-filled and the generated Customer ID is shown when returned by the API.

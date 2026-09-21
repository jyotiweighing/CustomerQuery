# Customer Query API

Base URL: `/api`

## Customer collection (`customers`)
- `POST /customers/register` - create customer
- `POST /customers/login` - login by `email` or `customerId`
- `POST /customers/forgot-password` - send OTP
- `POST /customers/verify-otp` - verify OTP
- `POST /customers/resend-otp` - resend OTP
- `POST /customers/reset-password` - reset after OTP verification
- `GET /customers/me` - logged-in customer profile
- `GET /customers` - Admin/Staff customer list

### Register customer JSON
```json
{
  "name": "Aarav Sharma",
  "companyName": "ABC Industries",
  "email": "aarav@example.com",
  "mobile": "9876543210",
  "password": "Customer@123",
  "address": "Industrial Area",
  "location": "Indore"
}
```

### Login JSON
```json
{ "email": "aarav@example.com", "password": "Customer@123" }
```
or
```json
{ "customerId": "CUS-00001", "password": "Customer@123" }
```

## Query collection (`queries`)
- `POST /queries` - Customer creates query (Bearer customer token)
- `GET /queries/my` - Customer's own queries
- `GET /queries/:id` - Query detail
- `GET /queries` - Admin/Staff query queue
- `PATCH /queries/:id/pick` - Admin/Staff picks query; Task is automatically created
- `POST /queries/:id/messages` - Add query conversation message

### Create query JSON
```json
{
  "subject": "Weighbridge display issue",
  "category": "Technical Support",
  "product": "Electronic Weighbridge",
  "priority": "High",
  "description": "Display is not showing correct weight.",
  "preferredContact": "Call",
  "partyDetails": {
    "poNumber": "PO-2026-1001",
    "billNumber": "INV-7788",
    "billDate": "2026-08-31",
    "partyName": "ABC Industries",
    "address": "Plot 22, Industrial Area",
    "location": "Indore",
    "contactPerson": "Aarav Sharma",
    "mobileNo": "9876543210",
    "email": "aarav@example.com"
  }
}
```

### Pick query
Logged-in Staff can pick for self with empty body:
```json
{}
```
Admin can pick for self with empty body, or assign/pick for a staff member:
```json
{
  "pickedById": "MONGODB_STAFF_ID",
  "pickedByRole": "staff"
}
```

When picked, a linked task is created in `tasks` with `sourceType: CustomerQuery`, `sourceQueryId`, `sourceQueryCode`, preferred contact and all party details. The query stores `taskId`, `taskCode`, `pickedBy` and becomes `Picked`. Later task status updates automatically synchronize the customer query to `In Progress` or `Resolved`.

## Admin: Assign Customer Query to Staff & Create Task

`PATCH /api/queries/:queryId/assign-staff`

Authorization: Admin bearer token

```json
{
  "staffId": "MONGODB_STAFF_ID"
}
```

On success the query status becomes `Assigned`, selected staff details are stored on the query, and a linked Task is automatically created in the `tasks` collection. The response contains both `data.query` and `data.task`. A query that already has a task cannot be assigned again.

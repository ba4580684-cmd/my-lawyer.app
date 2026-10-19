# LexDesk — Multi-tenant Lawyer Management MVP

A responsive lawyer practice-management application starter for Pakistan. Each lawyer registers an account and records are scoped to that account (`owner_id`). Includes client/case management, hearings, tasks, documents, fee agreements, invoices, payments, expenses, dashboard, CSV case report, English/Urdu preference, and a PostgreSQL schema.

## Stack
- Frontend: React, TypeScript, Vite, Material UI, TanStack Query installed for future data caching
- Backend: Node.js, Express, PostgreSQL (`pg`), JWT bearer authentication, bcrypt password hashing
- File uploads: local private upload directory for development; use private object storage in production

## Requirements
- Node.js 20+
- PostgreSQL 14+

## Setup

### 1. Database
Create a database and apply the schema:

```bash
createdb lawyer_management
psql "postgres://postgres:YOUR_PASSWORD@localhost:5432/lawyer_management" -f backend/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit DATABASE_URL and set JWT_SECRET to a long random secret (at least 32 characters)
npm install
npm run dev
```

API: `http://localhost:4000/api`; health check: `http://localhost:4000/api/health`.

### 3. Frontend
Open another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`, create a lawyer account, and begin entering test data.

## MVP notes / limitations to address before production

1. This is a working MVP starter, not a production security certification. Do not enter real confidential client data until you have reviewed and tested deployment security, access controls, backups, encryption, and applicable professional/legal obligations.
2. The current browser token is stored in `localStorage` for development simplicity. For production, prefer secure HTTP-only cookies plus CSRF protections or another reviewed session architecture.
3. File uploads use local disk in development. Configure private object storage, malware scanning, backup, retention, and access-controlled downloads for production and multi-instance hosting.
4. Automated reminder delivery, document version history UI, client portal, advanced invoice allocation UI, and full Urdu translation are not yet implemented. Urdu preference and RTL shell are present; several screen labels remain English and need translation QA.
5. Before public deployment, add automated tests, stricter per-field validation, pagination UI, account recovery/email verification, login/session revocation, and a reviewed audit/retention policy.
6. The generic resource CRUD API is tenant-scoped, but every future endpoint must repeat ownership checks for every referenced record. Do not assume UI filtering is a security boundary.

## Main API routes
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/dashboard`
- CRUD: `/api/clients`, `/api/cases`, `/api/hearings`, `/api/tasks`, `/api/notes`, `/api/feeAgreements`, `/api/invoices`, `/api/payments`, `/api/expenses`
- Documents: `POST /api/cases/:id/documents`, `GET /api/cases/:id/documents`, `GET /api/documents/:id/download`
- Reports: `GET /api/reports/summary.csv`

All `/api` routes other than health and auth register/login require `Authorization: Bearer <token>`.

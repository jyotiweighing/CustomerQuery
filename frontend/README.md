# DeskFlow — Customer Query Portal Admin Panel

A production-ready admin dashboard for managing customer support queries, built with React 19, Vite, Tailwind CSS v4, React Router, Recharts, React Hook Form, and Framer Motion. All data is dummy/mock (no backend required).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## What's included

- **Auth**: Login, Signup, Forgot Password, OTP Verification, Reset Password
- **Dashboard**: KPI cards, monthly/weekly/daily charts, response & resolution time trends, recent queries table
- **Queries**: Filterable/searchable list, ticket detail page with timeline, notes, attachments, assign-staff modal
- **Customers**: Searchable customer directory with query stats
- **Support Staff**: CRUD-style staff cards with add/edit modal, workload and performance bars
- **Departments**: Department overview with staff & query counts
- **Reports**: Summary cards, multiple charts, top/worst performing staff, date filters, CSV/Excel/PDF export buttons (UI only)
- **Analytics**: Response/resolution trends, peak hours, department comparison, staff performance radar, CSAT bars
- **Settings**: Profile, company, departments, roles & permissions, notifications, email templates, password, theme, language, security

## Folder structure

```
src/
  components/
    layout/    Sidebar, Header, AppShell
    cards/     KpiCard
    charts/    Recharts-based chart components
    tables/    QueriesTable
    modals/    AssignStaffModal
    common/    Button, Badge, FormInput, PageHeader
  pages/
    Auth/, Dashboard/, Queries/, Customers/, Staff/, Reports/, Analytics/, Settings/
  data/        Dummy JSON-like data (staff, customers, queries, analytics)
  hooks/, utils/
```

## Notes

- All data is generated locally in `src/data/` — no API calls are made.
- Export buttons (CSV/Excel/PDF) and a few toggles are UI-only placeholders, ready to be wired up to a real backend.
- Theme toggle in the header is a placeholder, per the brief.

# 📋 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
# VAALTIC CRM — Customer Relationship Management System
**Version:** 1.0  
**Date:** 17 May 2026  
**Project Path:** `d:\CUSTOMER`  
**Prepared By:** Development Team — Vaaltic Group  
**Status:** ✅ Active Development

---

## TABLE OF CONTENTS
1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [User Roles & Authentication](#4-user-roles--authentication)
5. [Admin Functional Requirements](#5-admin-functional-requirements)
6. [Salesman Functional Requirements](#6-salesman-functional-requirements)
7. [Approval Workflow](#7-approval-workflow)
8. [Database Schema](#8-database-schema)
9. [API Endpoint Catalogue](#9-api-endpoint-catalogue)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Self-Healing DB Migration Pattern](#12-self-healing-db-migration-pattern)
13. [Known Gaps & Future Roadmap](#13-known-gaps--future-roadmap)

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose
VAALTIC CRM is a full-stack, browser-based Customer Relationship Management system designed for **Vaaltic Group**. It is modelled on the Zoho CRM process architecture and provides two distinct user portals:
- **Admin Portal** — Global oversight, role management, and approval authority
- **Salesman Portal** — Individual sales agent workspace restricted to assigned records only

### 1.2 Scope
The system manages the complete sales lifecycle:
Lead capture → Contact creation → Deal pipeline → Quotation → Approval → Close

### 1.3 Goals
| Goal | Description |
|---|---|
| Role Isolation | Admin sees all records. Salesman sees only their own. |
| Process Flow | Mirrors Zoho-style lead-to-close pipeline |
| Approval Gate | Quotations and deals require Admin approval before finalisation |
| Self-Healing DB | Backend auto-migrates missing columns on startup |
| Premium UI | Dark-mode glassmorphic design — Slate/Purple/Indigo palette |

---

## 2. SYSTEM ARCHITECTURE

```
[Browser: localhost:3000]
        |
   [React + Vite Frontend]
        |
   [Vite Proxy → localhost:5000]
        |
   [Node.js / Express Backend]
        |
   [MS SQL Server Database]
```

### 2.1 Routing Overview
| URL Pattern | Component | Access |
|---|---|---|
| `/` | `LoginPage.jsx` | Public |
| `/admin/*` | `AdminDashboard.jsx` | Admin only |
| `/salesman/*` | `SalesmanDashboard.jsx` | Salesman only |
| `*` | 404 fallback | Public |

---

## 3. TECHNOLOGY STACK

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React + Vite | 18.x |
| **Frontend Routing** | React Router DOM | v6 |
| **Styling** | Tailwind CSS (utility classes inline) | 3.x |
| **Icons** | Lucide React | Latest |
| **Backend Runtime** | Node.js | 18.x |
| **Backend Framework** | Express.js | 4.x |
| **Database Driver** | mssql (node-mssql) | 10.x |
| **Database** | Microsoft SQL Server | 2019+ |
| **Environment Config** | dotenv | Latest |
| **CORS** | cors (npm) | Latest |
| **Body Parsing** | body-parser | Latest |

### 3.1 Environment Variables (`.env`)
```
DB_USER=<sql_username>
DB_PASSWORD=<sql_password>
DB_SERVER=<server_host>
DB_DATABASE=<database_name>
DB_PORT=1433
PORT=5000
```

---

## 4. USER ROLES & AUTHENTICATION

### 4.1 Role Types
| Role | Login Method | Dashboard Route |
|---|---|---|
| **Admin** | Hardcoded credentials (frontend) | `/admin/*` |
| **Salesman** | Database lookup via `/auth/signin` | `/salesman/*` |

### 4.2 Admin Authentication (FR-AUTH-01)
- **Credential Source:** Hardcoded in `LoginPage.jsx`
- **Email:** `admin@vaaltic.com`
- **Password:** `CRM123`
- **Session Storage:** `localStorage.setItem('role', 'admin')`
- **Redirect:** `/admin/` on success
- **Failure:** Display inline error message

### 4.3 Salesman Authentication (FR-AUTH-02)
- **Sign In:** `POST /auth/signin` with `{ email, password }`
  - Validates against `Salesman` table
  - Returns `{ salesmanId, username }` on success
  - Stores `role=salesman`, `userId`, `username` in `localStorage`
  - Redirects to `/salesman/`
- **Sign Up:** `POST /auth/signup` with `{ username, email, password }`
  - Creates a new row in `Salesman` table
  - Returns success, redirects to Sign In tab
- **Guard:** `SalesmanDashboard` reads `localStorage.role` on mount — if not `salesman`, redirects to `/`

### 4.4 Logout (FR-AUTH-03)
- Clears entire `localStorage`
- Resets React state
- Redirects to Login page (`/`)

---

## 5. ADMIN FUNCTIONAL REQUIREMENTS

### 5.1 Admin Dashboard Navigation
Admin uses **URL-based nested routing** under `/admin/*`.

| Sidebar Tab | Route | Module |
|---|---|---|
| Dashboard | `/admin/dashboard` | `DashboardAnalyticsModule` |
| Leads | `/admin/leads` | `LeadModule` |
| Contacts | `/admin/contacts` | `ContactModule` |
| Deals | `/admin/deals` | `DealModule` |
| Follow-ups | `/admin/followups` | `FollowUpModule` |
| Activity Log | `/admin/activitylogs` | `ActivityLogModule` |
| Segments | `/admin/segments` | `CustomerSegmentModule` |
| Quotation | `/admin/quotation` | `QuotationBuilderModule` |
| Email | `/admin/emailIntegration` | `EmailIntegrationModule` |
| Role Access | `/admin/roleaccess` | `RoleAccessModule` (Admin Only) |
| Approvals | `/admin/approvals` | `ApprovalsModule` (Admin Only) |

---

### 5.2 FR-ADMIN-01: Dashboard & Analytics
- Display system-wide KPIs: total leads, total deals, pipeline value, conversion rate
- Show recent activity feed
- Display charts/graphs of deal stages and lead sources
- Data is pulled globally — not filtered by salesman

### 5.3 FR-ADMIN-02: Lead Management (Global)
- **View:** All leads in system ordered by `createdAt DESC`
- **Add:** Create new lead with fields: `name, email, phone, company, status, source, assignedTo, lastContact, value`
- **Edit:** Update any field on any lead (COALESCE update — only changed fields applied)
- **Delete:** Remove any lead permanently
- **Assign:** Set `assignedTo` field to a salesman username to assign the lead
- **Statuses:** New, Contacted, Qualified, Proposal, Negotiation, Closed-Won, Closed-Lost

### 5.4 FR-ADMIN-03: Contact Management (Global)
- **View:** All contacts ordered by `id DESC`
- **Add:** Create contact with: `name, email, phone, company, notes, assignedTo`
- **Edit:** Update any field
- **Delete:** Remove any contact

### 5.5 FR-ADMIN-04: Deal Management (Global)
- **View:** All deals with columns: `dealName, value, stage, expectedCloseDate, contactName, company, assignedTo`
- **Add:** Create new deal
- **Edit:** Update deal stage or any field
- **Delete:** Remove deal
- **Stages:** Prospecting, Qualification, Proposal, Negotiation, Closed-Won, Closed-Lost
- **Auto-migration:** Backend adds `assignedTo` column to `Deals` table if missing

### 5.6 FR-ADMIN-05: Follow-Up Management (Global)
- View all follow-ups scheduled across all salesmen
- Add, edit, delete follow-ups
- Calendar/list view of upcoming follow-ups

### 5.7 FR-ADMIN-06: Activity Log (System Audit)
- View all system activity events
- Filter by date, salesman, or module
- Read-only audit trail — no edit/delete

### 5.8 FR-ADMIN-07: Customer Segments
- Create and manage customer groupings/segments
- Assign contacts or leads to segments
- View segment statistics

### 5.9 FR-ADMIN-08: Quotation Builder (Global)
- View all quotations across all salesmen
- Review submitted quotations
- Generate PDF preview: `GET /api/quotes/generate-pdf/:id`
- PDF preview renders: Client Name, Email, Item, Price, Quantity, Total, Drafted By, Date

### 5.10 FR-ADMIN-09: Email Integration
- Configure email settings for the CRM
- View sent email logs
- Admin can access all email records

### 5.11 FR-ADMIN-10: Role Access Control (Admin Exclusive)
- **View Roles:** `GET /api/roles` — list all roles and their permissions
- **Create Role:** `POST /api/roles/create` with `{ roleName, permissions }`
  - Permissions are comma-separated strings: e.g., `"lead,deal,email"`
  - Inserts into `Roles` table
- **Assign Role:** `POST /api/roles/assign` with `{ userId, role }`
  - Updates `Salesman.Role` column for specified user
- **Salesman cannot access this module**

### 5.12 FR-ADMIN-11: Approvals Management (Admin Exclusive)
- **View Pending:** `GET /api/approvals/pending` — list all records where `Status = 'Pending'`
- **Approve/Reject:** `POST /api/approvals/update` with `{ approvalId, status, remarks }`
  - `status` can be `'Approved'` or `'Rejected'`
  - Updates `Approvals` table with status + remarks + timestamp
- **Salesman cannot access this module**

---

## 6. SALESMAN FUNCTIONAL REQUIREMENTS

### 6.1 Salesman Dashboard Navigation
Salesman uses **tab-based navigation** (state-driven, not URL-driven).

| Tab Key | Module Rendered | Data Scope |
|---|---|---|
| `overview` | Welcome screen | — |
| `leads` | `LeadModule` | Own leads only |
| `contacts` | `ContactModule` | Own contacts only |
| `deals` | `DealModule` | Own deals only |
| `followups` | `FollowUpModule` | Own follow-ups |
| `activity` | `ActivityLogModule` | Own activities |
| `segments` | `CustomerSegmentModule` | Own segments |
| `quotes` | `QuotationBuilderModule` | Own quotations |
| `email` | `EmailIntegrationModule` | Own emails |

All modules receive: `role="salesman"`, `salesmanId={salesmanId}`, `username={username}`.

### 6.2 FR-SALESMAN-01: Lead Management (Filtered)
- View only leads where `assignedTo = salesmanId`
- Add new lead — `assignedTo` is auto-set to salesman's username
- Edit leads assigned to them
- Cannot delete leads (Admin only)
- Cannot assign leads to other salesmen

### 6.3 FR-SALESMAN-02: Contact Management (Filtered)
- View only contacts where `assignedTo` matches their username/id
- Add new contacts
- Edit their own contacts
- Cannot delete contacts (Admin only)

### 6.4 FR-SALESMAN-03: Deal Management (Filtered)
- View only deals where `assignedTo` matches their username/id
- Create new deals — `assignedTo` auto-set
- Update deal stage (move through pipeline)
- Submit deal for Admin approval via Approvals API

### 6.5 FR-SALESMAN-04: Follow-Up Scheduling
- View their own follow-ups
- Create follow-up entries linked to a lead/contact
- Edit/delete their own follow-ups

### 6.6 FR-SALESMAN-05: Activity Log (Personal)
- View only their own activity events
- Auto-logged when creating/updating leads, deals, contacts

### 6.7 FR-SALESMAN-06: Customer Segments
- View and manage segments they created
- Assign their leads/contacts to segments

### 6.8 FR-SALESMAN-07: Quotation Builder
- Create quotations with: `clientName, email, item, price, quantity`
- `assignedTo` is auto-set to salesman's username
- View their own submitted quotations
- Submit quotation for approval: `POST /api/approvals/submit`
  - Payload: `{ requestType: "Quote", referenceId: quoteId, submittedBy: salesmanId }`

### 6.9 FR-SALESMAN-08: Email Integration
- View email logs assigned to them
- Send/log emails related to their leads

---

## 7. APPROVAL WORKFLOW

### 7.1 Process Flow

```
Step 1: Salesman creates a Quotation or Deal
        POST /api/quotes  OR  POST /api/deals
                ↓
Step 2: Salesman submits for approval
        POST /api/approvals/submit
        Body: { requestType: "Quote"|"Deal", referenceId: ID, submittedBy: salesmanId }
        Inserts into Approvals table with Status = 'Pending'
                ↓
Step 3: Admin opens Approvals module
        GET /api/approvals/pending
        Sees list of all Pending requests with Type, Reference ID, Submitted By, Date
                ↓
Step 4: Admin makes decision
        POST /api/approvals/update
        Body: { approvalId, status: "Approved"|"Rejected", remarks: "..." }
        Updates Approvals table: Status, Remarks, UpdatedAt = GETDATE()
                ↓
Step 5: Record is finalised (Approved) or returned to Salesman (Rejected)
```

### 7.2 Approval Status Values
| Status | Meaning |
|---|---|
| `Pending` | Submitted by Salesman, awaiting Admin review |
| `Approved` | Admin approved — record is confirmed |
| `Rejected` | Admin rejected — Salesman must revise |

---

## 8. DATABASE SCHEMA

### 8.1 Table: `Salesman`
| Column | Type | Notes |
|---|---|---|
| `id` | INT PK Identity | Auto-increment |
| `username` | VARCHAR(255) | Salesman full name |
| `email` | VARCHAR(255) | Unique login email |
| `password` | VARCHAR(255) | Plain text (upgrade to bcrypt) |
| `Role` | VARCHAR(100) | Role assigned by Admin |

### 8.2 Table: `Leads`
| Column | Type | Notes |
|---|---|---|
| `id` | INT PK Identity | — |
| `name` | VARCHAR(255) | Lead full name |
| `email` | VARCHAR(255) | Lead email |
| `phone` | VARCHAR(50) | Phone number |
| `company` | VARCHAR(255) | Company name |
| `status` | VARCHAR(100) | New / Qualified / Closed etc. |
| `source` | VARCHAR(100) | Website / Referral / Cold Call |
| `assignedTo` | VARCHAR(255) | Salesman username |
| `lastContact` | DATETIME | Last interaction date |
| `value` | DECIMAL(10,2) | Estimated lead value |
| `createdAt` | DATETIME | Auto: GETDATE() |

### 8.3 Table: `Contacts`
| Column | Type | Notes |
|---|---|---|
| `id` | INT PK Identity | — |
| `name` | NVARCHAR(255) | — |
| `email` | NVARCHAR(255) | — |
| `phone` | NVARCHAR(50) | — |
| `company` | NVARCHAR(255) | — |
| `notes` | NVARCHAR(MAX) | Free-form notes |
| `assignedTo` | NVARCHAR(255) | Auto-added via migration |

### 8.4 Table: `Deals`
| Column | Type | Notes |
|---|---|---|
| `id` | INT PK Identity | — |
| `dealName` | NVARCHAR(255) | — |
| `value` | INT | Deal value in currency |
| `stage` | NVARCHAR(100) | Pipeline stage |
| `expectedCloseDate` | DATE | — |
| `contactName` | NVARCHAR(255) | Linked contact |
| `company` | NVARCHAR(255) | — |
| `assignedTo` | NVARCHAR(255) | Auto-added via migration |

### 8.5 Table: `Quotations`
| Column | Type | Notes |
|---|---|---|
| `id` | INT PK Identity | — |
| `clientName` | VARCHAR(255) | — |
| `email` | VARCHAR(255) | Client email |
| `item` | VARCHAR(255) | Product/service name |
| `price` | DECIMAL(10,2) | Unit price |
| `quantity` | INT | Number of units |
| `assignedTo` | VARCHAR(255) | Auto-added via migration |
| `createdAt` | DATETIME | Auto: GETDATE() |

### 8.6 Table: `Approvals`
| Column | Type | Notes |
|---|---|---|
| `ApprovalId` | INT PK Identity | — |
| `RequestType` | VARCHAR(100) | Quote / Deal |
| `ReferenceId` | VARCHAR(100) | ID of Quote or Deal |
| `SubmittedBy` | INT | FK to Salesman.id |
| `Status` | VARCHAR(50) | Pending / Approved / Rejected |
| `Remarks` | VARCHAR(MAX) | Admin comments |
| `SubmittedAt` | DATETIME | Auto: GETDATE() |
| `UpdatedAt` | DATETIME | Updated on Admin action |

### 8.7 Table: `Roles`
| Column | Type | Notes |
|---|---|---|
| `id` | INT PK Identity | — |
| `RoleName` | VARCHAR(100) | e.g., "Senior Sales", "Intern" |
| `Permissions` | VARCHAR(MAX) | Comma-separated: "lead,deal,email" |

> Tables `FollowUps`, `Activities`, `CustomerSegments`, `Emails` follow the same pattern with `assignedTo NVARCHAR(255)` column for RBAC filtering.

---

## 9. API ENDPOINT CATALOGUE

### 9.1 Auth Routes — `/auth`
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| POST | `/auth/signup` | Register new salesman | `{ username, email, password }` |
| POST | `/auth/signin` | Salesman login | `{ email, password }` |

### 9.2 Lead Routes — `/api/leads`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/:id` | Get lead by ID |
| POST | `/api/leads` | Create new lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### 9.3 Contact Routes — `/api/contacts`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/contacts` | Create contact |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |

### 9.4 Deal Routes — `/api/deals`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/deals` | Get all deals |
| POST | `/api/deals` | Create deal |
| PUT | `/api/deals/:id` | Update deal |
| DELETE | `/api/deals/:id` | Delete deal |

### 9.5 Quotation Routes — `/api/quotes`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quotes` | Get all quotations |
| POST | `/api/quotes` | Create quotation |
| GET | `/api/quotes/generate-pdf/:id` | Generate PDF preview HTML |

### 9.6 Approval Routes — `/api/approvals`
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| GET | `/api/approvals/pending` | List all pending approvals | — |
| POST | `/api/approvals/submit` | Submit for approval | `{ requestType, referenceId, submittedBy }` |
| POST | `/api/approvals/update` | Approve or Reject | `{ approvalId, status, remarks }` |

### 9.7 Role Routes — `/api/roles`
| Method | Endpoint | Description | Payload |
|---|---|---|---|
| GET | `/api/roles` | List all roles | — |
| POST | `/api/roles/create` | Create role | `{ roleName, permissions }` |
| POST | `/api/roles/assign` | Assign role to user | `{ userId, role }` |

### 9.8 Other Routes
| Route Prefix | Endpoints |
|---|---|
| `/api/followups` | CRUD for follow-ups |
| `/api/activities` | CRUD for activity logs |
| `/api/segments` | CRUD for customer segments |
| `/api/email` | Email integration logs |
| `/api/salesman` | Salesman dashboard KPIs |

---

## 10. NON-FUNCTIONAL REQUIREMENTS

### 10.1 Security
| ID | Requirement | Current Status |
|---|---|---|
| NFR-SEC-01 | Admin credentials must not be in frontend code | Currently hardcoded |
| NFR-SEC-02 | All passwords must be hashed with bcrypt | Currently plain text |
| NFR-SEC-03 | All API routes must validate JWT token | Not yet implemented |
| NFR-SEC-04 | Salesman cannot call Admin-only API endpoints | No backend guard yet |
| NFR-SEC-05 | CORS must restrict to known frontend origin | Currently open |

### 10.2 Performance
| ID | Requirement |
|---|---|
| NFR-PERF-01 | API responses under 500ms for standard queries |
| NFR-PERF-02 | Connection pooling via `mssql poolPromise` (already implemented) |
| NFR-PERF-03 | Frontend renders within 2 seconds on first load |

### 10.3 Availability
- Backend server: `localhost:5000`
- Frontend server: `localhost:3000`
- DB health check middleware on every request — returns HTTP 503 if DB is unreachable

---

## 11. UI/UX REQUIREMENTS

### 11.1 Design System
| Element | Specification |
|---|---|
| Color Scheme | Dark mode — Slate-900/950 background |
| Accent Colors | Purple-600 / Indigo-600 gradients |
| Typography | Inter font (system/Google Fonts) |
| Border Style | `border-slate-800` subtle separators |
| Card Style | `bg-slate-900/40 border border-slate-800/80 rounded-2xl` |
| Glassmorphism | `backdrop-blur-md` on headers and overlays |
| Animations | `animate-fade-in`, `animate-pulse` on status indicators |

### 11.2 Shared Components
| Component | File | Purpose |
|---|---|---|
| `Sidebar` | `components/Sidebar.jsx` | Left nav — adapts tabs based on `role` prop |
| Header Bar | Inline in dashboards | Shows role label, page title, live connection indicator |
| Module Container | Inline in dashboards | `max-w-7xl mx-auto` scrollable content area |

---

## 12. SELF-HEALING DB MIGRATION PATTERN

Several backend routes implement **auto-migration** to prevent failures when the DB schema is outdated.

### Pattern
```javascript
const ensureAssignedToColumn = async (pool) => {
  await pool.request().query(`
    IF NOT EXISTS (
      SELECT * FROM sys.columns 
      WHERE object_id = OBJECT_ID('TableName') AND name = 'assignedTo'
    )
    BEGIN
      ALTER TABLE TableName ADD assignedTo NVARCHAR(255) NULL;
    END
  `);
};
```

### Applied In
| Route File | Table Protected |
|---|---|
| `contactRoutes.js` | `Contacts` |
| `dealRoutes.js` | `Deals` |
| `quotationRoutes.js` | `Quotations` |

---

## 13. KNOWN GAPS & FUTURE ROADMAP

### 13.1 Security Fixes (High Priority)
| # | Gap | Fix Required |
|---|---|---|
| 1 | Admin login is hardcoded in frontend | Create `Admins` table, move to DB auth |
| 2 | Plain text passwords in `Salesman` table | Implement `bcrypt` hashing on signup |
| 3 | No JWT authentication on API | Add JWT middleware, protect all `/api/*` routes |
| 4 | Backend salesman filter is frontend-only | Add `?assignedTo=` query param filter in backend |
| 5 | CORS is fully open | Restrict to `localhost:3000` only |

### 13.2 Feature Enhancements (Medium Priority)
| # | Feature | Description |
|---|---|---|
| 1 | Salesman Dashboard KPIs | Personal stats: leads count, deals won, revenue this month |
| 2 | Notification System | Notify salesman when approval is resolved |
| 3 | Lead-to-Deal Conversion | One-click convert a Qualified Lead into a Deal |
| 4 | PDF Export | Print-ready quotation PDF via browser print API |
| 5 | Search & Filter | Global search across leads, contacts, deals |
| 6 | Pagination | All list views currently load all records — add page limits |

### 13.3 Infrastructure (Low Priority)
| # | Item | Description |
|---|---|---|
| 1 | Production Build | Run `npm run build`, deploy via IIS or nginx |
| 2 | Admin from DB | Store admin credentials in `Admins` table |
| 3 | Session Tokens | Replace localStorage with HTTP-only cookies + JWT |
| 4 | Audit Logging | Auto-log every CRUD operation to `Activities` table |

---

## REVISION HISTORY

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 17 May 2026 | Dev Team | Initial SRS — auto-generated from codebase analysis |

---

*© 2026 Vaaltic Group — Confidential Internal Document*

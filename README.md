# 🚀 Custora CRM

[![Live Site](https://img.shields.io/badge/Live%20Demo-Custora%20CRM-brightgreen?style=for-the-badge&logo=render)](https://crm-frontend-8w89.onrender.com)
[![Docker Support](https://img.shields.io/badge/Docker-Supported-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![React Version](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Prisma Version](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

**Custora** is a modern, high-performance Customer Relationship Management (CRM) system designed to streamline workflows for sales administrators and sales representatives. It features robust role-based access control, interactive dashboards with live analytics, leads/deals tracking, task automation, and client communication interfaces.

🔗 **Live Application URL**: [https://crm-frontend-8w89.onrender.com](https://crm-frontend-8w89.onrender.com)

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#%EF%B8%8F-tech-stack)
3. [System Architecture](#-system-architecture)
4. [Getting Started (Local Development)](#-getting-started-local-development)
   - [Method A: Using Docker Compose (Recommended)](#method-a-using-docker-compose-recommended)
   - [Method B: Manual Setup](#method-b-manual-setup)
5. [Database Seeding & Default Credentials](#-database-seeding--default-credentials)
6. [Cloud Deployment (Render)](#%EF%B8%8F-cloud-deployment-render)
7. [Utility Scripts](#%EF%B8%8F-utility-scripts)

---

## ✨ Key Features

### 👤 Role-Based Portals
- **Administrator Dashboard**:
  - Add and manage sales representatives (Salesmen).
  - High-level overview of global sales figures, total leads, conversion rates, and monthly revenue metrics using interactive charts.
  - Custom settings control.
- **Salesman Dashboard**:
  - Personalized overview showing individual performance charts, pending tasks, and recent lead developments.

### 💼 Lead & Deal Management
- **Leads Hub**: Track prospective clients, their current status, source, valuation, and assigned handler.
- **Visual Sales Pipeline**: Manage deals through different pipeline stages (Prospect, Proposal, Negotiation, Won, Lost) with probability estimations and expected close dates.

### 📅 Action Items & Productivity Tools
- **Tasks & Follow-Ups**: Priority-coded task manager linked to contacts to ensure no lead goes cold.
- **Customer Segmentation**: Segment contacts dynamically based on regions, industry fields, interests, and potential deal sizes.
- **Proposals & Quotations**: Generate and manage professional client quotations directly from the interface.

### ✉️ Built-In Email Client
- Dispatches custom-tailored marketing and transactional emails directly through the CRM dashboard integrated with Nodemailer.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **TypeScript**
- **Vite** (Next-generation frontend tooling)
- **React Router DOM v7** (Declarative routing)
- **Recharts** (Interactive charting and data visualizations)
- **Lucide React** (Consistent modern iconography)
- **Vanilla CSS** (Custom theme configured with responsive CSS Grid/Flexbox layouts and elegant glassmorphic components)

### Backend
- **Node.js** & **Express**
- **Prisma ORM** (Typesafe database client)
- **PostgreSQL** (Production-ready relational database)
- **JWT (JSON Web Tokens)** & **Bcrypt** (Secure authentication and password hashing)
- **Nodemailer** (Email transfer protocol service)

---

## 📐 System Architecture

```mermaid
graph TD
    subgraph Frontend (React + Vite)
        A[Client Browser] --> B[Login Page]
        A --> C[Admin Portal]
        A --> D[Salesman Portal]
    end

    subgraph Backend (Express API)
        E[API Gateway] --> F[Auth Middleware]
        F --> G[Controllers / Route Handlers]
        G --> H[Prisma Client]
    end

    subgraph Database Layer
        H --> I[(PostgreSQL)]
    end

    A -- HTTP Requests + JWT --> E
```

---

## ⚙️ Getting Started (Local Development)

Ensure you have [Git](https://git-scm.com/), [Node.js (v20+)](https://nodejs.org/), and [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### Method A: Using Docker Compose (Recommended)
This method spins up the frontend, backend, and PostgreSQL database automatically.

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd CRM
   ```
2. Build and run the services:
   ```bash
   docker-compose up --build
   ```
3. The services will be accessible at:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)

*Note: The backend Docker container includes a custom script `wait-and-start.sh` that automatically waits for the PostgreSQL service to accept connections, executes database migrations (`prisma db push`), and seeds the admin user.*

---

### Method B: Manual Setup

#### 1. PostgreSQL Database
Ensure you have a PostgreSQL server running locally, and create a database named `CRM_DB`.

#### 2. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory and populate it:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/CRM_DB?schema=public"
   JWT_SECRET="your_custom_jwt_secret"
   MAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   ```
4. Push database schema & run the seed file:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
5. Run the backend development server:
   ```bash
   npm run dev
   ```

#### 3. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
5. Access the application in your browser at the URL output by Vite (usually [http://localhost:5173](http://localhost:5173)).

---

## 🔑 Database Seeding & Default Credentials

The database is seeded with a default administrator account. No fake/demo data is seeded to ensure the dashboard starts with a clean slate for your organization.

### Default Admin Credentials
* **Email**: `admin@vaaltic.com`
* **Password**: `Admin123!`

Once logged in as an Admin, you can navigate to the user registration section to create salesman credentials. Salesmen cannot register themselves; they must be registered by an Administrator.

---

## ☁️ Cloud Deployment (Render)

This repository includes a `render.yaml` configuration file for instantaneous deployment to Render.

The template defines:
1. **`crm-db`**: A PostgreSQL database instance.
2. **`crm-backend`**: A web service deployed via Docker.
3. **`crm-frontend`**: A static web site built and served from the `frontend/` directory.

To deploy, connect your GitHub repository to Render and create a new Web Service using the blueprint configurations from `render.yaml`.

---

## 🕹️ Utility Scripts

The backend includes several helper scripts for database maintenance:

- **Reset Administrator Login**: Resets the default admin account credentials back to default.
  ```bash
  node reset_admin.js
  ```
- **Clear Database**: Deletes all leads, deals, tasks, and sales representatives (keeping only the administrator).
  ```bash
  node clear_db.js
  ```

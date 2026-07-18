# StyleSlot

StyleSlot is a full-stack salon booking web application built with Next.js, Prisma, PostgreSQL, TypeScript, Tailwind CSS, and Vercel. It allows customers to book salon appointments from a public booking page, while salon staff can log in to a protected dashboard to manage services and appointments.

## Live Demo

[Visit StyleSlot](https://styleslot-psi.vercel.app/)

## Overview

StyleSlot was built as a portfolio-ready full-stack project to demonstrate practical web development skills across public booking workflows, protected admin access, service management, appointment management, database integration, production deployment, and real-world application structure.

The app is now at **StyleSlot v1.1.0 — Improved booking validation & UX**, which builds on the initial v1.0.0 release by tightening customer booking validation and polishing the booking experience.

## Features

- Public customer booking page with service-based appointment flow
- Slot availability handling with conflict detection to prevent double bookings
- Strict **10‑digit mobile number validation** on booking (client + server) with subtle completion feedback for users
- Staff login system with protected dashboard access
- Service management (create, edit, activate/deactivate services)
- Appointment management (view, filter by date/status, search by customer/phone/service, reschedule, complete, cancel)
- Daily and 7‑day insights: summary cards, popular services, and revenue breakdown
- PostgreSQL database integration via Prisma ORM
- Production deployment on Vercel

## Tech Stack

- **Frontend:** Next.js App Router, React, Tailwind CSS, CSS
- **Backend:** Next.js Server Components, Route Handlers, server actions and server-side logic
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** Custom admin login with protected dashboard access
- **Validation:** Zod for robust server-side validation of booking and admin forms
- **Utilities:** date-fns, clsx
- **Deployment:** Vercel
- **Language:** TypeScript

## Project Structure

```bash
styleslot/
│── prisma/
│── src/
│   │── app/
│   │── components/
│   │── lib/
│── public/
│── middleware.ts
│── package.json
│── prisma.config.ts
│── tsconfig.json
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/styleslot.git
   cd styleslot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   ADMIN_LOGIN_PASSWORD=your_admin_password
   ADMIN_AUTH_TOKEN=your_admin_auth_token
   ```

4. Generate and migrate the database (Prisma):
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open the app in your browser:
   ```bash
   http://localhost:3000
   ```

## Environment Variables

The project requires these environment variables:

- `DATABASE_URL` — PostgreSQL database connection string
- `ADMIN_LOGIN_PASSWORD` — Admin login password for dashboard access
- `ADMIN_AUTH_TOKEN` — Token used for admin session validation

## Core Routes

- `/` — Customer booking page (service selection, date & slot selection, contact details with 10‑digit phone validation)
- `/login` — Staff login page
- `/dashboard` — Protected staff/admin dashboard with daily overview and analytics
- `/dashboard/services` — Manage services
- `/dashboard/appointments/[id]/edit` — Edit appointment details and reschedule

## Release History

- **v1.1.0 — Improved booking validation & UX**
  - Enforced 10‑digit mobile number validation on the booking form (client and server)
  - Improved phone input UX with real‑time completion cue when the number is valid
  - Minor visual refinements to keep the booking flow consistent and reassuring

- **v1.0.0 — Initial Live Release**
  - Public customer booking page
  - Service-based appointment booking flow and slot availability handling
  - Staff login system and protected dashboard access
  - Service and appointment management
  - PostgreSQL + Prisma integration and production deployment on Vercel

## Preview

<img width="1896" height="903" alt="image" src="https://github.com/user-attachments/assets/f177822f-8396-496b-8c27-d46ecf5bd76e" />
<img width="1897" height="914" alt="image" src="https://github.com/user-attachments/assets/e5ac6843-6e5b-47ef-95af-3ce064628175" />


## Author

Developed by **Akshat Trivedi**.

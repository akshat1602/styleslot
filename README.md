# StyleSlot

StyleSlot is a full-stack salon booking web application built with Next.js, Prisma, PostgreSQL, TypeScript, Tailwind CSS, and Vercel. It allows customers to book salon appointments from a public booking page, while salon staff can log in to a protected dashboard to manage services and appointments.

## Live Demo

[Visit StyleSlot](https://styleslot-psi.vercel.app/)

## Overview

StyleSlot was built as a portfolio-ready full-stack project to demonstrate practical web development skills across public booking workflows, protected admin access, service management, appointment management, database integration, production deployment, and real-world application structure. GitHub portfolio READMEs are strongest when they include a concise overview, a live demo, the main technologies used, and a clear explanation of the problem the project solves. [web:430][web:431]

## Tech Stack

- **Frontend:** Next.js App Router, React, Tailwind CSS, CSS
- **Backend:** Next.js Server Components, Route Handlers, Server-side logic
- **Database:** PostgreSQL, Prisma ORM
- **Authentication:** Custom admin login with protected dashboard access
- **Validation:** Zod
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

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser:
   ```bash
   http://localhost:3000
   ```

## Environment Variables

The project requires these environment variables:

- `DATABASE_URL` — PostgreSQL database connection string.
- `ADMIN_LOGIN_PASSWORD` — Admin login password for dashboard access.
- `ADMIN_AUTH_TOKEN` — Token used for admin session validation.

## Routes

- `/` — Customer booking page
- `/login` — Staff login page
- `/dashboard` — Protected staff/admin dashboard
- `/dashboard/services` — Manage services
- `/dashboard/appointments/[id]/edit` — Edit appointment details

## Preview
<img width="1892" height="913" alt="Screenshot 2026-07-12 213805" src="https://github.com/user-attachments/assets/0b1798bf-469f-4099-b221-c6bb5e644cb0" />
<img width="1893" height="911" alt="Screenshot 2026-07-12 213830" src="https://github.com/user-attachments/assets/40ebaa1d-8ed0-401e-97a4-9f3a4c115966" />
<img width="1904" height="913" alt="Screenshot 2026-07-12 213904" src="https://github.com/user-attachments/assets/65e38c83-c2c8-4005-8c25-5dac6c616fb3" />

## Author

Developed by **Akshat Trivedi**.

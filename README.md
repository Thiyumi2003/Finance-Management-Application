# Finance Management Application

Modern MERN-based personal finance management app with authentication, multi-account support, transactions, transfers, analytics, and monthly reports.

## Screenshots

### Public Pages

![Home page](screenshots/home.png)
![Login page](screenshots/login.png)
![Register page](screenshots/register.png)

### Dashboard And Management

![Dashboard](screenshots/dashboard.png)
![Accounts](screenshots/accounts.png)
![Categories](screenshots/catogories.png)
![Transactions](screenshots/transaction.png)
![Transfers](screenshots/transfer.png)
![Monthly report](screenshots/report.png)

## Tech Stack

- Frontend: React, Vite, React Router DOM, Axios, Tailwind CSS, Recharts
- Backend: Node.js, Express.js, JWT, bcrypt.js, Mongoose
- Database: MongoDB Atlas

## Features

- User registration and login
- Protected dashboard routes
- Account management for wallet, bank, and business accounts
- Income, expense, and transfer management
- Category management
- Dashboard analytics and monthly reports
- Print-friendly monthly report view

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `backend/.env` with your Atlas URI:

   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret
   NODE_ENV=development
   ```

3. Start the backend:

   ```bash
   npm start --workspace backend
   ```

4. Start the frontend:

   ```bash
   npm run dev --workspace frontend
   ```

## Notes

- The landing page is the default entry point.
- Authenticated routes are grouped under `/dashboard`.
- The monthly report view is designed to print cleanly.
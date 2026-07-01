# Finance Management Application

Modern MERN-based personal finance management app with authentication, multi-account support, transactions, transfers, analytics, and monthly reports.

## Screenshots

### Public Pages

<table>
   <tr>
      <td align="center">
         <img src="screenshots/home.png" alt="Home page" width="320" />
         <br />Home page
      </td>
      <td align="center">
         <img src="screenshots/login.png" alt="Login page" width="320" />
         <br />Login page
      </td>
   </tr>
   <tr>
      <td align="center">
         <img src="screenshots/register.png" alt="Register page" width="320" />
         <br />Register page
      </td>
      <td></td>
   </tr>
</table>

### Dashboard And Management

#### Accounts Page

<p align="center">
   <img src="screenshots/accounts.png" alt="Accounts" width="520" />
</p>
<table>
   <tr>
      <td align="center">
         <img src="screenshots/dashboard.png" alt="Dashboard" width="320" />
         <br />Dashboard
      </td>
      <td align="center">
         <img src="screenshots/catogories.png" alt="Categories" width="320" />
         <br />Categories
      </td>
      <td align="center">
         <img src="screenshots/transaction.png" alt="Transactions" width="320" />
         <br />Transactions
      </td>
   </tr>
   <tr>
      <td align="center">
         <img src="screenshots/transfer.png" alt="Transfers" width="320" />
         <br />Transfers
      </td>
      <td align="center">
         <img src="screenshots/report.png" alt="Monthly report" width="320" />
         <br />Monthly report
      </td>
   </tr>
</table>

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
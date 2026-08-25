# 💰 Professional Expense Tracker

A full-stack web application for managing personal finances, tracking income and expenses, setting budgets, and generating financial reports.

The application is built using HTML, CSS, JavaScript, Node.js, Express.js, MongoDB Atlas, Mongoose, JWT authentication, bcryptjs, and Chart.js.

---

## 🚀 Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected API routes
- Authentication state management
- Logout functionality
- Current-user profile API

---

### 📊 Dashboard

The dashboard provides an overview of the user's financial activity.

Features include:

- Total Income
- Total Expenses
- Balance
- Savings
- Income vs Expenses chart
- Expenses by Category chart
- Transaction listing
- Search
- Transaction type filtering
- Category filtering
- Date filtering
- Edit transactions
- Delete transactions

---

### 💳 Transaction Management

Users can manage their financial transactions.

Supported operations:

- Create transaction
- View transactions
- Update transaction
- Delete transaction

Transaction information includes:

- Type
- Title
- Amount
- Category
- Date
- Description
- User reference

---

### 💰 Budget Management

The application provides category-based budget management.

Features include:

- Create budget
- View budgets
- Update budget
- Delete budget
- Category-based budgets
- Spending calculation
- Remaining budget
- Budget progress
- Overspending detection

---

### 📈 Financial Reports

The reports section provides financial analysis for a selected month and year.

Features include:

- Total income
- Total expenses
- Net savings
- Transaction count
- Highest expense category
- Highest category amount
- Average expense
- Largest transaction
- Savings rate
- Expense ratio
- Financial health status
- Category-wise expense analysis
- Income vs Expenses chart
- Expenses by Category chart

---

### 👤 Profile

Users can manage their account information through the profile section.

Features include:

- View current profile
- Update profile information
- Account management
- Logout

---

### 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive layouts are implemented for:

- Navigation
- Dashboard
- Forms
- Cards
- Charts
- Tables
- Filters
- Reports
- Budget pages
- Profile pages

---

# 🛠️ Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js

## Backend

- Node.js
- Express.js

## Database

- MongoDB Atlas
- Mongoose

## Authentication & Security

- JSON Web Tokens (JWT)
- bcryptjs
- Protected API routes
- User-specific database queries
- Backend validation

---

# 📁 Project Structure

```text
Expense tracker/
│
├── client/
│   └── src/
│       ├── css/
│       │   ├── style.css
│       │   ├── dashboard.css
│       │   ├── login.css
│       │   └── responsive.css
│       │
│       ├── js/
│       │   ├── auth.js
│       │   ├── charts.js
│       │   ├── dashboard.js
│       │   ├── editTransaction.js
│       │   ├── login.js
│       │   ├── profile.js
│       │   ├── register.js
│       │   ├── reports.js
│       │   └── transaction.js
│       │
│       └── pages/
│           ├── index.html
│           ├── dashboard.html
│           ├── login.html
│           ├── register.html
│           ├── profile.html
│           ├── transaction.html
│           ├── edit-transaction.html
│           ├── budget.html
│           └── reports.html
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── reportController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone or download the project

Place the project on your computer.

Then open the project in VS Code.

---

## 2. Install backend dependencies

Open a terminal:

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

Inside the `server` folder create:

```text
.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key
```

### Important

Never upload your `.env` file to GitHub.

Add this to `.gitignore`:

```text
node_modules/
.env
```

---

# 🗄️ MongoDB Atlas Setup

1. Create a MongoDB Atlas account.
2. Create or select your cluster.
3. Create a database user.
4. Configure Network Access.
5. Add your development IP address.
6. Copy the MongoDB connection string.
7. Put the connection string inside `.env`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/expenseTracker
```

Do not expose your real database credentials publicly.

---

# ▶️ Running the Backend

Navigate to the server directory:

```bash
cd server
```

Run:

```bash
node server.js
```

If nodemon is configured:

```bash
npm run dev
```

Expected output:

```text
MongoDB Connected Successfully
Server running on http://localhost:5000
```

---

# 🌐 Running the Frontend

Open the `client/src/pages` directory using a local development server such as VS Code Live Server.

Start with:

```text
login.html
```

or:

```text
index.html
```

Make sure the backend is running before using authenticated features.

---

# 🔌 API Overview

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Users

### Current User

```http
GET /api/users/me
```

Requires authentication.

---

## Transactions

### Create

```http
POST /api/transactions
```

### Get Transactions

```http
GET /api/transactions
```

### Update

```http
PUT /api/transactions/:id
```

### Delete

```http
DELETE /api/transactions/:id
```

All transaction routes require authentication.

---

## Budgets

### Create

```http
POST /api/budgets
```

### Get

```http
GET /api/budgets
```

### Update

```http
PUT /api/budgets/:id
```

### Delete

```http
DELETE /api/budgets/:id
```

---

## Reports

### Summary

```http
GET /api/reports/summary
```

### Category

```http
GET /api/reports/category
```

### Monthly

```http
GET /api/reports/monthly
```

Report routes require authentication.

---

# 🔐 Authentication

The application uses JWT authentication.

After successful login, the frontend stores the authentication token and sends it with protected API requests.

Protected requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend verifies the token before allowing access to protected resources.

---

# 🛡️ Security

The application implements several security measures:

- JWT authentication
- Password hashing with bcryptjs
- Protected routes
- Backend validation
- Authenticated-user identification
- User-specific transaction queries
- User-specific budget queries
- User-specific report queries
- Environment variables for secrets
- Centralized database connection

Users should only be able to access their own financial data.

---

# 📊 Reports

The reports system calculates financial information for the selected period.

It provides:

```text
Income
Expenses
Savings
Transaction Count
Category Analysis
Average Expense
Largest Transaction
Savings Rate
Expense Ratio
Financial Status
```

Charts are generated using Chart.js.

---

# 🧪 Testing

Recommended testing flow:

```text
1. Start MongoDB connection
2. Start backend
3. Open frontend
4. Register a user
5. Login
6. Add income
7. Add expense
8. Verify dashboard totals
9. Edit a transaction
10. Delete a transaction
11. Apply transaction filters
12. Create a budget
13. Add expenses for the budget category
14. Check budget progress
15. Open Reports
16. Verify report calculations
17. Open Profile
18. Update profile
19. Logout
20. Login again
```

---

# 🖼️ Screenshots

Screenshots can be added here in the future.

Example:

```text
## Dashboard

![Dashboard Screenshot](screenshots/dashboard.png)

## Reports

![Reports Screenshot](screenshots/reports.png)

## Budget

![Budget Screenshot](screenshots/budget.png)
```

---

# 🚀 Future Improvements

Possible future improvements include:

- Export reports to PDF
- Export transactions to CSV
- Recurring transactions
- Advanced date-range reports
- Email notifications
- Budget notifications
- Dark mode
- Advanced financial analytics
- Multi-currency support
- Data visualization improvements
- Progressive Web App support
- Cloud deployment
- Automated testing
- CI/CD pipeline

---

# 👨‍💻 Project Purpose

This project was developed as a full-stack web application to demonstrate practical skills in:

- Frontend development
- Backend development
- REST API design
- Database management
- Authentication
- Authorization
- Data visualization
- Responsive UI development
- Full-stack application architecture

---

# 📄 License

This project is intended for educational and portfolio purposes.
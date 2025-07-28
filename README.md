## Getting Started

### 1. Prerequisites

- Clone this Repository
- Docker and Docker Compose installed

### 2. Environment Setup

1. At the root of the project, unzip env.zip

2. This will extract:

```bash
/backend/env.txt
/frontend/env.txt
```

3. Rename all env.txt to .env

4. Ensure the renamed .env files are placed in the correct folders:

```bash
backend/.env -> Contains DB connection, JWT secret, etc.
frontend/.env -> Contains Vite config (e.g., VITE_API_URL)
```

## DB

This project uses **PostgreSQL** as the database and **MikroORM** as the ORM.

1. Start the PostgreSQL Database via Docker.
   Make sure Docker is running, then start the DB using:

```bash
docker-compose up -d
OR
docker compose up -d
```

2. Create Initial DB Schema via Migration

```bash
npx mikro-orm migration:create
npx mikro-orm migration:up
```

## Backend

To get the backend up and running on your local machine, follow these steps:

1. Make sure you navigate to backend folder.

2. Instal all dependencies:

```bash
npm install
```

3. Run seed script to create:

- Default admin and user accounts
- Sample products

```bash
npm run seed
```

4. Start the backend development server:

```bash
npm run dev
```

## Frontend

To start frontend app

1. Make sure you navigate to frontend folder.

2. Instal all dependencies:

```bash
npm install
```

4. Start the frontend development server:

```bash
npm run dev
```

5. Open your web browser and navigate to: http://localhost:5173/

## Frontend Overview

The frontend is built with React + Vite, styled with Material UI and tailwindcss, and uses @tanstack/react-query for data fetching and caching.

### Features

- **Login page** ('/login'):
  - Authenticates user and redirects based on role
- **Admin dashboard** ('/admin'):
  - View all products in a data table
  - Add, edit, delete products
- **Store page (for users)** ('/store'):
  - Product listing
  - View product details
  - Add to cart
  - View and update cart items
  - Checkout flow and record the order history

### Walkthrough

1. Start at http://localhost:5173/. It will auto redirect to /login if is if not authenticated

2. Login with Admin or User credentials

   - Admin: Goes to /admin
     ```bash
     Email: admin@mandai.com
     Password: admin123
     ```
   - User: Goes to /store
     ```bash
     Email: user@mandai.com
     Password: user123
     ```

3. For Admin:

   - View product table
   - Click the "Add Product" button to create
   - Click the "Pencil" icon to edit product or "Bin" icon to delete product from the action column of each row

4. For User:

   - Browse products in card view
   - Click "View Details" to see the product details
   - Click "Add to Cart" to add the product to your shopping cart
   - Access the cart by clicking the shopping cart icon in the top navbar to update item quantities or proceed to checkout
   - Checkout creates a new order in the DB

5. Logout via avatar menu on top navbar

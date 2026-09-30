# Prarabdh E-Commerce

A full-stack e-commerce web application built for **Prarabdh Mamgain**.

## Tech Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- CSS

## Features
- User registration and login
- Product browsing and search
- Category filtering
- Product details
- Shopping cart
- Quantity update/remove
- Checkout and order creation
- My Orders
- Admin dashboard
- Admin product CRUD
- Admin order status management
- Responsive UI

## Run

### Backend
```bash
cd server
npm install
```

Create `.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/prarabdh_ecommerce
JWT_SECRET=prarabdh_super_secret_key
PORT=5000
```

Then:
```bash
npm run dev
```

### Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Admin
Register a normal account first. Then in MongoDB change its `role` from `user` to `admin`.

This project uses a demo checkout flow; no real payment is charged.

# Vegetable Ordering Platform

A full-stack web application for ordering bulk vegetables and fruits, built with React and Node.js.

## 🚀 Features

- **Product Catalogue**: Browse fresh produce with real-time pricing.
- **Order Placement**: Simple form to place bulk orders.
- **Order Tracking**: Track delivery status using a unique Order ID.
- **Admin Dashboard**: 
    - Add, Update, and Delete products.
    - View all orders and update their status (Pending → Shipped → Delivered).
- **Responsive Design**: Works on mobile and desktop.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (Persistent file-based storage).

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js installed.

### 1. Backend Setup
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:3001
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

## 🌍 Deployment

### Backend (Render)
- **Repo**: Use the `server` directory.
- **Env Vars**: `DB_PATH=/var/data/database.sqlite`.
- **Disk**: Mount a disk at `/var/data` for persistent storage.

### Frontend (Netlify)
- **Repo**: Use the `client` directory.
- **Build Command**: `npm run build`.
- **Publish Directory**: `dist`.
- **Env Vars**: `VITE_API_URL=https://your-render-app-url.onrender.com`.

For detailed deployment steps, please refer to [deployment_guide.md](./deployment_guide.md).

# Deployment Guide

Follow these steps to deploy your application.

## Prerequisites

1.  **GitHub Account**: You need a GitHub account to host your code.
2.  **Netlify Account**: For the Frontend.
3.  **Render Account**: For the Backend.

## Step 1: Push Code to GitHub

Since your project is not yet a Git repository, initialize it and push to GitHub.

1.  Create a **new repository** on GitHub (e.g., `veg-ordering-app`).
2.  Open your terminal in `C:\Users\USERNAME\Vegitable` and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/veg-ordering-app.git
git push -u origin main
```

## Step 2: Deploy Backend (Render)

1.  Log in to [Render.com](https://render.com/).
2.  **Create a Database** (PostgreSQL):
    - Click **New +** -> **PostgreSQL**.
    - Name: `veg-db`.
    - Plan: **Free**.
    - Click **Create Database**.
    - Wait for it to become available.

3.  **Create Web Service**:
    - Click **New +** -> **Web Service**.
    - Connect your GitHub repository.
    - **Configuration**:
        - **Root Directory**: `server`
        - **Environment**: `Node`
        - **Build Command**: `npm install`
        - **Start Command**: `node server.js`
        - **Plan**: Free
    - **Environment Variables**:
        - Click **Add from other Resource**
        - Select your `veg-db` database.
        - It will automatically add `DATABASE_URL`.
    - Click **Create Web Service**.

## Step 3: Deploy Frontend (Netlify)

1.  Log in to [Netlify.com](https://netlify.com/).
2.  Click **Add new site** -> **Import from existing project**.
3.  Connect **GitHub** and select your repository.
4.  **Configuration**:
    - **Base directory**: `client`
    - **Build command**: `npm run build`
    - **Publish directory**: `client/dist` (Netlify usually detects `dist`, but ensure it's correct).
5.  **Environment Variables**:
    - Click **Add environment variable**.
    - **Key**: `VITE_API_URL`
    - **Value**: [Your Render Backend URL] (e.g., `https://veg-server.onrender.com`)
    - *Note: Do not add a trailing slash `/`.*
6.  Click **Deploy**.

## Step 4: Final Verification

1.  Open your Netlify URL.
2.  Try to view products (fetches from Render).
3.  Try to place an order (writes to Render database).

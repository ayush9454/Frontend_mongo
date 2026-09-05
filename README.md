# 🅿️ Smart Parking Management System

A full-stack parking management application built with **React (TypeScript)** frontend and **Node.js/Express + MongoDB** backend.

> **✅ Runs 100% offline** — No cloud database, no external services needed. The backend uses an embedded MongoDB instance that stores data locally.

---

## 📋 Prerequisites

Before running this project, make sure you have **only these two things** installed:

| Tool | Required Version | Download Link |
|------|-----------------|---------------|
| **Node.js** | v18 or higher (v24.x recommended) | [https://nodejs.org](https://nodejs.org) |
| **npm** | Comes bundled with Node.js | — |

> **That's it!** You do NOT need to install MongoDB separately. The app uses an embedded MongoDB instance automatically.

### Verify Installation

```bash
node --version    # Should print v18.x.x or higher
npm --version     # Should print 9.x.x or higher
```

---

## 🚀 Quick Start (Step-by-Step)

### Step 1: Clone or Download the Project

```bash
# Option A: Clone from Git
git clone <your-repo-url>
cd "Smart Parking System"

# Option B: If you received a ZIP file
# Just extract it and open a terminal in the extracted folder
```

### Step 2: Set Up Environment Files

The `.env` files are **not included in the repo** (they're gitignored for security). You need to create them from the provided templates:

**Backend environment:**
```bash
cp Backend-MongoDb-main/.env.example Backend-MongoDb-main/.env
```

**Frontend environment:**
```bash
cp Frontend_mongo-main/.env.example Frontend_mongo-main/.env
cp Frontend_mongo-main/.env.example Frontend_mongo-main/.env.local
```

> **No changes needed** — the default values in the `.example` files work perfectly for local/offline use.

### Step 3: Install Dependencies

```bash
# Install backend dependencies
cd Backend-MongoDb-main
npm install

# Install frontend dependencies
cd ../Frontend_mongo-main
npm install

# Go back to the project root
cd ..
```

### Step 4: Run the Project

You have **two options**:

#### Option A: One-command start (Mac/Linux only)
```bash
chmod +x start.sh
./start.sh
```
This starts both backend and frontend together and stops both with `Ctrl+C`.

#### Option B: Manual start (Works on all OS including Windows)

Open **two separate terminals**:

**Terminal 1 — Backend:**
```bash
cd Backend-MongoDb-main
npm start
```

**Terminal 2 — Frontend:**
```bash
cd Frontend_mongo-main
npm start
```

### Step 5: Open the App 🎉

| Service  | URL |
|----------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend API | [http://localhost:5050/api](http://localhost:5050/api) |

The app will auto-seed sample parking spaces on first run.

---

## 🪟 Windows-Specific Instructions

The `start.sh` script is a bash script and won't run directly on Windows. Use one of these alternatives:

**Option 1: Use two Command Prompt / PowerShell windows** (recommended)
```cmd
:: Terminal 1
cd Backend-MongoDb-main
npm start

:: Terminal 2
cd Frontend_mongo-main
npm start
```

**Option 2: Use Git Bash** (if you have Git for Windows installed)
```bash
./start.sh
```

---

## 📁 Project Structure

```
Smart Parking System/
├── Backend-MongoDb-main/     # Node.js + Express API server
│   ├── server.js             # Main server file
│   ├── models/               # Mongoose data models
│   ├── api/                  # API route handlers
│   ├── seed-data.js          # Sample parking data (auto-loaded)
│   ├── .env.example          # Environment template (copy to .env)
│   └── package.json
│
├── Frontend_mongo-main/      # React + TypeScript + Material UI
│   ├── src/                  # React source code
│   ├── public/               # Static assets
│   ├── .env.example          # Environment template (copy to .env & .env.local)
│   └── package.json
│
├── start.sh                  # One-command launcher (Mac/Linux)
└── README.md                 # ← You are here
```

---

## 🔧 How It Works Offline

The backend is configured to **automatically spin up an embedded MongoDB instance** using `mongodb-memory-server` when no external `MONGO_URI` is provided in the `.env` file.

- Data is **persisted** in `Backend-MongoDb-main/.mongo_data/` directory
- On first run, sample parking spaces are **auto-seeded** into the database
- No internet connection needed after `npm install` is complete

---

## ❓ Troubleshooting

### `npm install` fails
- Make sure you have Node.js v18+ installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and try again: `rm -rf node_modules && npm install`

### Backend fails to start
- Check that port 5050 is free: `lsof -i :5050` (Mac/Linux) or `netstat -ano | findstr :5050` (Windows)
- Make sure `.env` file exists in `Backend-MongoDb-main/`

### Frontend fails to start
- Check that port 3000 is free
- Make sure `.env` and `.env.local` files exist in `Frontend_mongo-main/`
- If you see TypeScript errors, they are non-blocking (the app is configured to compile despite TS errors)

### First run takes a long time
- This is normal! `mongodb-memory-server` downloads a MongoDB binary on first launch (~100MB)
- **This one-time download requires internet**, but after that everything runs offline
- The binary is cached in your home directory and reused

### "Cannot connect to MongoDB" error
- If using the embedded DB, just ensure the first `npm install` completed successfully
- The `.mongo_data/` folder is auto-created; make sure the app has write permissions

---

## 📌 Summary: Complete Command Sequence

```bash
# 1. Clone
git clone <repo-url>
cd "Smart Parking System"

# 2. Setup env files
cp Backend-MongoDb-main/.env.example Backend-MongoDb-main/.env
cp Frontend_mongo-main/.env.example Frontend_mongo-main/.env
cp Frontend_mongo-main/.env.example Frontend_mongo-main/.env.local

# 3. Install dependencies
cd Backend-MongoDb-main && npm install && cd ..
cd Frontend_mongo-main && npm install && cd ..

# 4. Run (pick one)
./start.sh                  # Mac/Linux: both at once
# OR open two terminals and run "npm start" in each folder
```


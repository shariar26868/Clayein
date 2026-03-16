<div align="center">

# 🏢 BizTrack

### Business Financial Analytics Platform

*Real-time financial analysis, investor management, and AI-powered insights for your business*

![Version](https://img.shields.io/badge/version-1.0.0-7c6dfa?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

</div>

---

## ✨ Features

### 👑 Super Admin
- 📊 **Company Dashboard** — সব products এর combined financial overview
- 📦 **Product Management** — add, edit, delete products with full analysis
- 💰 **Inventory Calculator** — quantity × price = auto stock value
- 👥 **Investor Management** — per-product investor login credentials তৈরি করো
- 📸 **Monthly Snapshots** — প্রতি মাসের data freeze করে history রাখো
- 🤖 **AI Report Generator** — OpenAI দিয়ে professional financial report
- 🔮 **AI Forecast** — historical data দেখে next month prediction
- 🔐 **Secure Login** — JWT authentication + forgot password via email

### 💼 Investor Portal
- 🔒 **Per-product login** — প্রতিটা product এর আলাদা credentials
- 📈 **Own investment view** — invested amount, equity %, profit share
- 📊 **Read-only dashboard** — product analysis দেখতে পারবে, edit করতে পারবে না
- 🌙 **Dark UI** — professional dark theme

### 📊 Analytics
- Revenue, Expenses, Profit, Margin calculation
- Equity breakdown (company vs investors)
- Profit distribution per investor
- ROI calculation
- Company valuation (Capital + Assets)
- Monthly trend charts
- Smart insights & alerts

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, Chart.js, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (Admin + Investor separate tokens) |
| **AI** | OpenAI GPT-4o-mini |
| **Email** | Nodemailer + Gmail |
| **Deployment** | Docker + Docker Compose |
| **Style** | Custom dark CSS (JetBrains Mono + Syne) |

---

## 📁 Project Structure

```
biztrack/
├── frontend/                          # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx     # Company overview
│   │   │   ├── ProductDetail.jsx      # Single product analysis
│   │   │   ├── AdminLogin.jsx         # Admin login
│   │   │   ├── ForgotPassword.jsx     # Password reset request
│   │   │   ├── ResetPassword.jsx      # New password form
│   │   │   ├── InvestorLogin.jsx      # Investor login
│   │   │   └── InvestorView.jsx       # Investor dashboard
│   │   ├── components/
│   │   │   ├── KPICard.jsx
│   │   │   ├── EvalCard.jsx
│   │   │   ├── EquityBreakdown.jsx
│   │   │   ├── ProfitShareCard.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── AlertBox.jsx
│   │   │   └── AIReportModal.jsx
│   │   ├── services/
│   │   │   └── api.js                 # All API calls
│   │   └── utils/
│   │       ├── calc.js                # Financial formulas
│   │       └── format.js              # ৳ formatting
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                           # Node.js + Express
│   ├── models/
│   │   ├── Admin.js                   # Admin user
│   │   ├── Product.js                 # Product data
│   │   ├── ProductAccess.js           # Investor credentials
│   │   └── Snapshot.js                # Monthly history
│   ├── controllers/
│   │   ├── adminAuthController.js     # Login, forgot, reset
│   │   ├── productController.js       # Product CRUD
│   │   ├── investorController.js      # Investor auth + view
│   │   ├── snapshotController.js      # Monthly snapshots
│   │   └── aiController.js            # AI report + forecast
│   ├── routes/
│   │   ├── adminAuth.js
│   │   ├── admin.js
│   │   ├── products.js
│   │   ├── investor.js
│   │   ├── snapshots.js
│   │   └── ai.js
│   ├── middleware/
│   │   ├── adminAuth.js               # Admin JWT guard
│   │   └── investorAuth.js            # Investor JWT guard
│   ├── utils/
│   │   └── calcEngine.js              # Core calculation logic
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- [OpenAI API Key](https://platform.openai.com) (for AI features)
- Gmail account (for password reset emails)

---

### 1. Clone the repo

```bash
git clone https://github.com/shariar26868/Clayein.git
cd Clayein
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

`backend/.env` file বানাও:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
ADMIN_JWT_SECRET=any_long_random_string
INVESTOR_JWT_SECRET=another_long_random_string
OPENAI_API_KEY=sk-your-openai-key
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

```bash
npm run dev
# BizTrack running on :5000 🚀
# MongoDB connected ✅
```

---

### 3. Frontend setup

নতুন terminal এ:

```bash
cd frontend
npm install
```

`frontend/.env` file বানাও:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# http://localhost:5173
```

---

### 4. Create admin account (first time only)

Backend চলা অবস্থায়:

```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

---

### 5. Open in browser

| URL | Who |
|-----|-----|
| `http://localhost:5173/admin/login` | Super Admin |
| `http://localhost:5173/investor/login` | Investors |

---

## 🐳 Docker Deployment

Root এ `.env` file বানাও:

```env
MONGO_URI=your_mongodb_atlas_connection_string
ADMIN_JWT_SECRET=any_long_random_string
INVESTOR_JWT_SECRET=another_long_random_string
OPENAI_API_KEY=sk-your-openai-key
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://your-domain.com
```

তারপর:

```bash
docker-compose up --build -d
```

| Service | URL |
|---------|-----|
| Frontend | `http://localhost` |
| Backend API | `http://localhost:5000` |

---

## 🔐 Access Control

```
Super Admin ──→ /admin/login ──→ Full dashboard (all products, edit, AI)
                                         │
                                         ↓
                              Creates investor credentials
                                         │
                                         ↓
Investor ──────→ /investor/login ──→ Own product only (read-only)
```

**Admin** — JWT token (7 days), email + password login
**Investor** — JWT token (7 days), per-product unique username + password

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/setup` | First-time admin create |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/forgot` | Send reset email |
| POST | `/api/auth/reset/:token` | Reset password |

### Products (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products |
| GET | `/api/products/:id` | Single product + metrics |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/products/:id/investors` | Add investor access |
| DELETE | `/api/products/:id/investors/:aId` | Remove investor |

### Admin Summary
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/summary` | Company-wide combined metrics |

### Investor
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/investor/login` | Investor login |
| GET | `/api/investor/me` | Own product data |

### Snapshots
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/snapshots/:productId` | Save monthly snapshot |
| GET | `/api/snapshots/:productId` | Get history |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/report/:productId` | Generate financial report |
| POST | `/api/ai/forecast/:productId` | Generate forecast |

---

## 💡 Usage Guide

### Adding a Product
1. Admin dashboard এ `+ New Product` click করো
2. Name, category দিয়ে create করো
3. Product page এ revenue, expenses, stock, capital data দাও
4. `Save` click করো

### Adding an Investor
1. Product page এ `+ Add Investor` click করো
2. Investor name, username, password, invested amount, profit share % দাও
3. Investor কে তাদের username + password দাও
4. তারা `/investor/login` থেকে login করবে

### Monthly Snapshot
1. Product page এ `Snapshot` button click করো
2. Current month এর data save হয়ে যাবে
3. Trend chart এ দেখা যাবে

### AI Features
1. Product page এ `🤖 AI Analysis` button click করো
2. **Report** বা **Forecast** select করো
3. Language (English/বাংলা) select করো
4. Generate করো

---

## ⚙️ Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `ADMIN_JWT_SECRET` | JWT secret for admin tokens |
| `INVESTOR_JWT_SECRET` | JWT secret for investor tokens |
| `OPENAI_API_KEY` | OpenAI API key |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |
| `CLIENT_URL` | Frontend URL (for reset email links) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use for personal or commercial projects.

---

<div align="center">

Built with ❤️ using React, Node.js, MongoDB & OpenAI

</div>
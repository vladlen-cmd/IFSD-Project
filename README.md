# 🎗️ Donation Seva

A modern, full-stack donation management platform built with **MongoDB**, **Express.js**, **React**, and **Node.js**. Features Apple-inspired minimal design, secure authentication, and real-time donation tracking.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![React](https://img.shields.io/badge/React-18.0+-blue)
![Node.js](https://img.shields.io/badge/Node.js-16.0+-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)

## ✨ Features

### 🔐 **Authentication System**
- Secure user registration and login
- JWT-based authentication with httpOnly cookies
- Protected routes and middleware
- Password encryption with bcrypt

### 💰 **Donation Management**
- **Preset donation amounts**: ₹100, ₹500, ₹1000, ₹2500, ₹5000
- **Donation categories**: Education, Healthcare, Environment, Emergency Relief
- Real-time donation processing and tracking
- Indian Rupee (₹) currency support

### 📊 **User Dashboard**
- **Overview**: Total donations, donation count, favorite cause
- **Donation History**: Complete transaction records
- **Impact Reports**: Category-wise donation analytics
- **Settings**: Account and preference management

## 🏗️ Project Structure

```
donation-mern-app/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── donationController.js # Donation processing logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Donation.js          # Donation schema
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── donationRoutes.js    # Donation routes
│   ├── utils/
│   │   └── generateToken.js     # JWT token utilities
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx # Route protection component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global authentication state
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Signup.jsx       # Registration page
│   │   │   ├── Home.jsx         # Main donation interface
│   │   │   └── Dashboard.jsx    # User dashboard
│   │   ├── services/
│   │   │   └── api.js           # Axios API configuration
│   │   ├── styles/
│   │   │   ├── Auth.css         # Authentication styles
│   │   │   └── Home.css         # Main application styles
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Global styles
│   │   └── main.jsx             # React app entry point
│   ├── index.html               # HTML template
│   ├── package.json
│   └── vite.config.js           # Vite configuration
│
├── README.md                    # Project documentation
└── .gitignore                   # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   cd IFSD-Project
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGO_URI=mongodb://localhost:27017/donation-seva
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   PORT=5001" > .env
   
   # Start backend server
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🔧 Environment Variables

Create `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/donation-seva
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5001
```

## 📡 API Endpoints

### Authentication
```http
POST /api/auth/signup     # User registration
POST /api/auth/login      # User login
```

### Donations
```http
GET    /api/donations           # Get user's donations
POST   /api/donations           # Create new donation
GET    /api/donations/stats     # Get donation statistics
```

## 🛠️ Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🎯 Key Technologies

### Backend
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **CSS3** - Modern styling with flexbox/grid

## Design

- **Mobile First** approach
- **Breakpoints**: 
  - Mobile: 320px+
  - Tablet: 768px+
  - Desktop: 1024px+
- **Flexible Layouts** with CSS Grid and Flexbox
- **Touch-Friendly** interface elements

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
```bash
# Build command
npm install

# Start command
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory
dist/
```

# 🏥 MediBook - Patient-Doctor Appointment System

A modern, full-stack web application that connects patients with healthcare professionals, enabling seamless appointment booking and management.

## ✨ Features

### 🧑‍⚕️ **For Doctors**
- Professional profile management
- Appointment scheduling and management
- Patient consultation history
- Real-time availability updates
- Consultation fee management

### 👤 **For Patients**
- Find and book appointments with doctors
- Search by specialization, location, and rating
- Appointment history and management
- Real-time appointment status updates
- Secure profile management

### 🔐 **Authentication & Security**
- JWT-based authentication
- Role-based access control (Patient/Doctor/Admin)
- Secure password handling
- Protected API endpoints

## 🚀 Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Lucide React** for icons
- **React Hot Toast** for notifications

### **Backend**
- **Node.js** with Express.js
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/medibook.git
cd medibook
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Setup
Create `.env` files in both backend and frontend directories with your configuration.

### 4. Database Setup
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Start the Application
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Rich Midnight Purple (`#1A1A2E`)
- **Secondary**: Warm Gold (`#FFD700`)
- **Accent**: Soft Lavender (`#E6E6FA`)
- **Neutral**: Light Gray (`#F5F5F5`)

## 🔒 Security Features

- JWT Authentication with secure token handling
- Password Hashing using bcrypt
- Input Validation on all forms
- SQL Injection Prevention through Prisma ORM
- CORS Protection for API endpoints

## 📱 Responsive Design

Fully responsive design optimized for Desktop, Tablet, and Mobile devices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License**.

## 📞 Support

- **Email**: support@medibook.com
- **Issues**: GitHub Issues
- **Documentation**: Project Wiki

---

**Made with ❤️ for better healthcare accessibility**

*Last updated: January 2025*

# 💼 JobBoard Web: Full-Stack Recruitment Portal

A comprehensive recruitment platform designed to bridge the gap between employers and job seekers. Built with the MERN Stack, this application features secure role-based access, real-time email notifications, and seamless document handling.

🔴 **Live Demo:** https://job-board-seven-beige.vercel.app/

⚙️ **Backend API:** https://job-board-backend-nohm.onrender.com

## 🚀 Professional Highlights

- **Role-Based Architecture:** Distinct workflows for Employers (Post/Manage) and Candidates (Search/Apply).
- **Automated Communication:** Integrated Nodemailer for instant email alerts upon application submission.
- **Secure Document Management:** Handled via Multer for robust PDF resume uploads.
- **State Management:** Utilized React Context API for seamless user sessions across the platform.

## ✨ Key Features

### 🏢 Employer Dashboard (Admin)

- **Job Lifecycle Management:** Full CRUD operations (Create, Read, Update, Delete) for job listings.
- **Applicant Tracking System (ATS):** View candidate lists, download resumes directly, and manage application statuses (Accept/Reject).
- **Instant Notifications:** Real-time email triggers to stay updated on new talent.

### 👨‍💻 Candidate Experience

- **Advanced Search:** Filter listings by keyword and location.
- **One-Click Applications:** Fast-track application process with secure file uploads.
- **Personal Tracking:** A dedicated "Application History" section to monitor progress and status updates.

## 🛠️ Technical Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js, React Router, Context API, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Security | JWT (JSON Web Tokens), Bcrypt.js |
| Utilities | Nodemailer, Multer |

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas Account
- HP Victus or similar dev environment with Windows 11 / Linux

### 1. Clone & Install

```bash
git clone https://github.com/prashantmore45/job-board-web-app.git
cd job-board-web-app
```

### 2. Backend Configuration

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

```bash
cd backend
npm install
npm start
```

### 3. Frontend Configuration

```bash
cd ../frontend
npm install
npm start
```

## 📜 Attribution

This project was originally developed during a Web Development Internship at CodSoft (Jan-Feb 2026). It has since been refactored and migrated to this dedicated repository for enhanced maintenance and feature scaling.

# 🚀 Level 2 Task: Job Board Application

A robust recruitment platform built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). This application facilitates the hiring process by connecting Employers with Candidates through a feature-rich interface.

🔴 **Live Demo:** [Insert Your Vercel Link Here]  
⚙️ **Backend API:** [Insert Your Render Link Here]

## ✨ Key Features

### 🏢 For Employers (Admin)
- **Dashboard:** centralized hub to view active job postings.
- **Job Management:** Post new jobs, **Edit** details, or **Delete** listings.
- **Applicant Tracking:** View list of applicants, download **PDF Resumes**, and update status (**Accept/Reject**).
- **Automated Emails:** Receive instant email notifications via **Nodemailer** when a candidate applies.

### 👨‍💻 For Candidates (Job Seekers)
- **Job Search:** Filter jobs by Keyword (Title) and Location.
- **One-Click Apply:** Securely upload resumes (PDF) to apply for jobs.
- **Application History:** Track applied jobs and see real-time status updates (e.g., "Accepted").
- **Profile Management:** Update personal details.

### 🛡️ Security & Architecture
- **Authentication:** JWT-based login/signup with role separation (Employer vs. Candidate).
- **Protection:** Protected Routes ensure users cannot access unauthorized pages.
- **File Handling:** Server-side file upload handling using **Multer**.

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router, Context API, CSS3
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Tools:** Nodemailer (Email), Multer (File Upload), Bcrypt (Password Hashing)

## 🚀 How to Run Locally

1. **Clone the repository**

2. **Backend Setup:**
```bash
cd backend
npm install
# Create .env file with MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS
npm start

```
3. **Frontend Setup**
```Bash

cd frontend
npm install
npm start

```
### 📸 Screenshots
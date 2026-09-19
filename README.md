# Interview Pilot 🚀

**Interview Pilot** is a simple AI-powered campus placement preparation platform designed to help students prepare effectively for upcoming interviews.

Students often have to manage multiple interviews, different companies, technical topics, projects, and HR preparation at the same time. Interview Pilot brings these activities together in one platform.

The system allows a student to:

* Create an account and log in
* Upload their resume
* Add upcoming placement interviews
* Store interview details such as company, date, and round
* Analyze the resume and interview information using **Google Gemini**
* Generate a personalized interview preparation plan
* View the preparation plan through a simple dashboard
* Manage interview schedules and preparation information

The main idea of the project is:

> **Resume + Interview Schedule → AI Analysis → Personalized Preparation Plan**

---

## 🎯 Problem Statement

Students preparing for campus placements often follow a general preparation strategy without considering:

* Their individual skills
* Projects mentioned in their resume
* Technologies they already know
* The company they are interviewing for
* The type of interview round
* The amount of time available before the interview

As a result, preparation can become unorganized and students may spend time revising topics that are not immediately relevant.

Interview Pilot addresses this problem by using the student's resume and upcoming interview information to generate a more structured and personalized preparation plan.

---

## 💡 Proposed Solution

Interview Pilot provides a centralized platform where students can manage their placement preparation.

The application collects:

1. **Student information**
2. **Resume**
3. **Upcoming interview details**

These inputs are processed by the backend and provided to **Google Gemini**.

Gemini analyzes the available information and generates a preparation plan containing areas such as:

* Resume strengths
* Technical topics
* Project preparation
* HR preparation
* Interview-specific preparation
* Day-wise preparation
* Final interview tips

The generated plan can then be viewed through the application dashboard.

---

# 🔄 System Flowchart

```text
                         ┌─────────────────────┐
                         │       Student       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                     ┌──────────────────────────┐
                     │   Register / Login       │
                     └────────────┬─────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │      Upload Resume         │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │   Add Interview Schedule   │
                    │                            │
                    │ Company | Date | Round     │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │     Express.js Backend     │
                    └─────────────┬──────────────┘
                                  │
                         ┌────────┴────────┐
                         │                 │
                         ▼                 ▼
              ┌──────────────────┐  ┌──────────────────┐
              │  MongoDB Atlas   │  │   Resume File    │
              │                  │  │                  │
              │ Users            │  │ Uploaded Resume  │
              │ Interviews       │  │                  │
              │ Preparation Plans│  └────────┬─────────┘
              └──────────────────┘           │
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │     Google Gemini   │
                                  │                     │
                                  │ Resume + Interview  │
                                  │ Analysis            │
                                  └──────────┬──────────┘
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │ Personalized        │
                                  │ Preparation Plan    │
                                  └──────────┬──────────┘
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │     MongoDB Atlas   │
                                  │  Store Preparation  │
                                  │        Plan         │
                                  └──────────┬──────────┘
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │      Dashboard      │
                                  │                     │
                                  │ Next Interview      │
                                  │ Interview Schedule  │
                                  │ Preparation Plan    │
                                  └─────────────────────┘
```

---

# 🏗️ Application Architecture

```text
┌───────────────────────────────────────────────────────────────┐
│                         FRONTEND                              │
│                                                               │
│  Login │ Register │ Dashboard │ Interviews │ Profile │ Plan  │
│                                                               │
│                 HTML + CSS + JavaScript                       │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                │ HTTP Requests
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                         BACKEND                               │
│                                                               │
│                     Node.js + Express.js                      │
│                                                               │
│  Authentication │ Resume Upload │ Interviews │ AI Generation │
└───────────────┬───────────────────────────────┬───────────────┘
                │                               │
                │                               │
                ▼                               ▼
┌─────────────────────────────┐    ┌────────────────────────────┐
│       MongoDB Atlas         │    │       Google Gemini         │
│                             │    │                            │
│ Users                       │    │ Resume Analysis             │
│ Interviews                  │    │ Interview Analysis          │
│ Preparation Plans           │    │ Plan Generation             │
└─────────────────────────────┘    └────────────────────────────┘
```

---

# ✨ Key Features

## 1. User Registration

Students can create an account using:

* Name
* Email
* Password

The user information is stored in MongoDB.

---

## 2. User Login

Registered students can log into the application and access the Interview Pilot dashboard.

---

## 3. Resume Upload

Students can upload their resume through the profile section.

Supported formats:

* PDF
* DOC
* DOCX

The uploaded resume is used as an input for AI-based preparation planning.

---

## 4. Interview Scheduling

Students can add upcoming interviews by entering:

* Company name
* Interview date
* Interview round

Example:

```text
Company: TCS
Date: 25 September 2026
Round: Technical Interview
```

The interview information is stored in MongoDB.

---

## 5. Upcoming Interview Tracking

The dashboard automatically identifies the next upcoming interview.

The student can quickly see:

```text
Next Interview

Company: TCS
Date: 25 September 2026
Round: Technical Interview
```

---

## 6. AI-Powered Preparation Plan

Google Gemini analyzes:

* Student resume
* Company information provided through the interview entry
* Interview date
* Interview round

The AI generates a structured preparation plan.

The plan can include:

### Technical Preparation

Important technical concepts to revise.

### Project Preparation

Questions and topics related to projects mentioned in the resume.

### HR Preparation

Common HR questions and preparation suggestions.

### Day-wise Preparation

A practical schedule based on the upcoming interview.

### Final Preparation

Last-minute revision and interview tips.

---

## 7. Preparation Plan Storage

The generated preparation plan is stored in MongoDB.

This allows the application to retrieve and display the plan through the preparation plan page.

---

## 8. Dashboard

The dashboard provides a central view of the student's preparation status.

It can display:

* Next interview
* Number of upcoming interviews
* Preparation plan status
* Resume status
* Quick actions
* Preparation plan access

---

# 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### AI

* Google Gemini API
* `@google/genai`

### File Upload

* Multer

### DevOps

* Docker
* Jenkins
* Git
* GitHub

### Development Tools

* VS Code
* npm

---

# 📂 Project Structure

```text
interview-pilot/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── interviews.html
│   ├── plan.html
│   └── style.css
│
├── models/
│   ├── User.js
│   ├── Interview.js
│   └── PreparationPlan.js
│
├── config/
│   └── db.js
│
├── uploads/
│
├── server.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
└── .env
```

---

# 🔌 Main Application Flow

### Step 1 — Register

The student creates an account.

```text
Student → Register → MongoDB
```

### Step 2 — Login

The student enters their credentials.

```text
Student → Login → Express Backend → MongoDB
```

### Step 3 — Upload Resume

The student uploads their resume.

```text
Student → Resume → Express + Multer → Resume Storage
```

### Step 4 — Add Interview

The student enters the upcoming interview details.

```text
Company + Date + Round
            ↓
       Express.js
            ↓
       MongoDB Atlas
```

### Step 5 — Generate Preparation Plan

The backend sends the relevant information to Gemini.

```text
Resume
   +
Interview Details
   ↓
Express.js
   ↓
Google Gemini
   ↓
Preparation Plan
```

### Step 6 — Store Plan

The generated plan is saved in MongoDB.

```text
Gemini
   ↓
Generated Plan
   ↓
MongoDB Atlas
```

### Step 7 — Display Plan

The student accesses the plan through the dashboard.

```text
MongoDB
   ↓
Express.js
   ↓
Preparation Plan Page
```

---

# 🗄️ Database Design

The application uses MongoDB with Mongoose.

## Users

Stores student account information.

```text
Users
 ├── name
 ├── email
 ├── password
 └── resume
```

## Interviews

Stores upcoming interview information.

```text
Interviews
 ├── company
 ├── date
 └── round
```

## Preparation Plans

Stores AI-generated preparation plans.

```text
PreparationPlans
 ├── interviewId
 ├── company
 ├── generatedDate
 └── plan
```

---

# 🤖 AI Workflow

The AI component is responsible for generating the preparation plan.

```text
                  Student Resume
                        │
                        ▼
                ┌───────────────┐
                │               │
                │ Google Gemini │
                │               │
                └───────┬───────┘
                        │
                        ▲
                        │
              Interview Details
                        │
                        │
              Company / Date / Round
                        │
                        ▼
               Personalized Plan
```

The AI is used as a **background planning engine**, rather than as a chatbot.

This keeps the application simple and focused on its main purpose: helping students organize their interview preparation.

---

# 🐳 Docker

The application can be containerized using Docker.

Build the Docker image:

```bash
docker build -t interview-pilot .
```

Run the application:

```bash
docker run --env-file .env -p 8900:8900 interview-pilot
```

The application runs on:

```text
http://localhost:8900
```

---

# 🔄 CI/CD with Jenkins

Jenkins is used to automate the project's build process.

The pipeline performs steps such as:

```text
GitHub Repository
       ↓
     Clone
       ↓
Install Dependencies
       ↓
   Docker Check
       ↓
 Docker Image Build
       ↓
  Run Container
```

This provides an automated workflow for building and running the application.

---

# ⚙️ Installation and Setup

## 1. Clone the repository

```bash
git clone https://github.com/praneethsanjay7-droid/Interview_Pilot.git
```

```bash
cd Interview_Pilot
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create `.env`

Create a `.env` file in the root directory.

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit the `.env` file to GitHub.

## 4. Start the server

```bash
node server.js
```

## 5. Open the application

```text
http://localhost:8900
```

---

# 🔐 Environment Variables

The application requires:

| Variable         | Purpose                          |
| ---------------- | -------------------------------- |
| `MONGODB_URI`    | MongoDB Atlas connection         |
| `GEMINI_API_KEY` | Google Gemini API authentication |

---

# 🎯 Project Objective

The main objective of Interview Pilot is to provide students with a simple platform that converts their:

**Resume + Interview Schedule**

into:

**A structured and personalized interview preparation plan.**

The project combines web development, database management, AI integration, and DevOps practices into one practical application.

---

# 🚀 Future Enhancements

The current version focuses on the core functionality. Possible future improvements include:

* Secure password hashing
* User-specific interview management
* Task completion tracking
* Preparation progress tracking
* Email reminders for upcoming interviews
* Company-specific preparation resources
* Improved authentication using sessions or JWT
* More detailed AI-generated preparation schedules

These features are not required for the current MVP but can be added as the project evolves.

---

# 📌 Current Project Scope

Interview Pilot intentionally focuses on **simple and practical placement preparation**.

It is not intended to be:

* A complete AI mock interviewer
* A coding platform
* A voice-analysis system
* A facial-analysis system
* A complex recruitment platform
* A multi-model AI system

The primary goal is:

> **To help students organize their upcoming interviews and prepare using an AI-generated personalized plan.**

---

# 👨‍💻 Project Summary

**Interview Pilot** demonstrates the integration of:

```text
Frontend Development
        +
Backend Development
        +
Database Management
        +
AI Integration
        +
Docker
        +
Jenkins
        +
Git/GitHub
```

into a single practical campus placement application.

The system provides a simple workflow from **student registration to personalized interview preparation**, making it easier for students to organize their placement preparation in one place.

---

## ⭐ Core Workflow

```text
REGISTER
   ↓
LOGIN
   ↓
UPLOAD RESUME
   ↓
ADD INTERVIEW
   ↓
GEMINI ANALYZES INFORMATION
   ↓
GENERATE PREPARATION PLAN
   ↓
STORE IN MONGODB
   ↓
VIEW ON DASHBOARD
   ↓
PREPARE FOR INTERVIEW
```

**Interview Pilot — Prepare smarter. Stay organized. Be interview-ready.**

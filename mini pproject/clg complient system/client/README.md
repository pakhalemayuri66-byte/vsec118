# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
# CampusCare – College Complaint Management System

## 📌 Project Overview

CampusCare is a web-based College Complaint Management System that allows students to submit complaints about college facilities and services. It helps manage complaints digitally and makes it easier to track their status.

The main goal of this project is to provide a simple, user-friendly platform for students to report problems and for college staff to manage complaints efficiently.

## 🎯 Objectives

- Provide an online platform to submit college complaints.
- Allow students to view complaint details and status.
- Help organize and manage complaints systematically.
- Reduce paperwork and manual complaint handling.
- Store complaint information in a database.

## ✨ Features

- **User Registration and Login** – Users can create an account and log in.
- **Complaint Submission** – Students can submit complaints with a title, category, and description.
- **Complaint Management** – View and manage submitted complaints.
- **Complaint Status** – Track complaints as Pending, In Progress, or Resolved.
- **Search and Filter** – Find complaints by keyword or status.
- **Database Integration** – Store complaint information in MongoDB.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML | Web page structure |
| CSS | Styling and layout |
| JavaScript | Client-side functionality |
| React.js | Frontend user interface |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MongoDB | Database |
| Mongoose | Database connection and data modeling |
| Git and GitHub | Version control and project hosting |

## 📂 Project Structure

```text
CampusCare/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/pakhalemayuri66-byte/vsec118.git
```

### 2. Navigate to the CampusCare project folder

Open the folder containing the `client` and `server` directories.

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the server folder and configure the required MongoDB connection and authentication secrets. Never upload `.env` to GitHub.

### 5. Start the backend

```bash
node server.js
```

### 6. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed in the terminal to use the application.

## 🗄️ Database

CampusCare uses MongoDB to store complaint information. Mongoose is used to define schemas and interact with the database.

## 🔮 Future Enhancements

- Role-based dashboards for students, staff, and administrators.
- Private complaint access for the student who submitted it.
- Email or SMS notifications about complaint status.
- Complaint analytics and reports.
- Image attachments for complaints.

## 🎓 Project Purpose

This mini-project was developed as part of academic learning to gain practical experience in full-stack web development, database management, and REST API development.

## 👩‍💻 Author

**Mayuri Sharad Pakhale**  
TY B.Tech Information Technology  
KBT College of Engineering, Nashik

## 📄 License

This project is developed for educational purposes.

# 📚 Library Management System

## 📖 About the Project

The **Library Management System** is a web-based application developed to simplify and manage library operations. It provides a user-friendly interface to manage book records and store book information in a MongoDB database.

The project uses React for the frontend and Node.js with Express.js for the backend. MongoDB is used to store library data.

## 🎯 Objectives

- To manage book records digitally.
- To add and view books in the library database.
- To simplify library record management.
- To validate book information entered by users.
- To provide a simple and user-friendly interface.
- To connect the frontend with the backend API.

## ✨ Features

- **Book Management:** Add and manage book records.
- **Database Integration:** Store book information in MongoDB.
- **Form Validation:** Validate book titles and author names.
- **REST API:** Communicate between the frontend and backend.
- **User Interface:** Interactive dashboard built with React.
- **Authentication:** Login and registration functionality, if enabled in the current version.

## 🛠️ Technologies Used

- **Frontend:** React.js, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **API Testing:** Thunder Client
- **Development Tools:** Visual Studio Code, npm

## 📂 Project Structure

```text
library mini project/
├── client/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── ...
├── models/
├── routes/
│   ├── auth.js
│   └── bookRoutes.js
├── server.js
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project Folder

```bash
cd "library mini project"
```

### 3. Install Backend Dependencies

Run this command in the project root directory:

```bash
npm install
```

### 4. Configure MongoDB

Ensure MongoDB is running locally. The backend connects to:

```text
mongodb://127.0.0.1:27017/libraryDB
```

### 5. Start the Backend Server

```bash
node server.js
```

The backend runs at:

```text
http://localhost:3000
```

### 6. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## 🗄️ Database

The application uses MongoDB to store library data.

- **Database Name:** `libraryDB`
- **Books Collection:** Stores book records managed by the application.

## 🧪 API Testing

Thunder Client can be used to test the backend API.

Example endpoint:

```text
GET http://localhost:3000/api/books
```

Use the appropriate POST, PUT, or DELETE endpoints defined in `routes/bookRoutes.js` to test other book operations.

## 🔮 Future Enhancements

- Book issue and return management.
- Student/member management.
- Due-date tracking and fine calculation.
- Search and filter books.
- Improved authentication and access control.
- Book availability tracking.

## 👩‍💻 Author

**Mayuri Sharad Pakhale**

TY B.Tech – Information Technology

## 📝 Conclusion

The Library Management System demonstrates how a web application can simplify library record management using React, Node.js, Express.js, and MongoDB. It provides a foundation for managing book information and can be extended with additional library features in the future.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

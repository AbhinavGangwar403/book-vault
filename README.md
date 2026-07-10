# 📚 BookVault

A full-stack personal library management system built with **Node.js, Express.js, PostgreSQL, and EJS**. BookVault allows users to organize, review, and manage their book collection through a clean and responsive interface with secure authentication and analytics.

---

## 🚀 Features

### 📖 Book Management

* Create, Read, Update and Delete books
* View detailed information for every book
* Automatic book cover retrieval using ISBN
* Responsive card-based library layout

### 🔐 Authentication

* Secure login using Express Sessions
* Password hashing with bcrypt
* Protected routes for creating, editing and deleting books
* Public access to browse the library

### 🔍 Search & Filtering

* Search books by title or author
* Sort by:

  * Newest
  * Oldest
  * Rating
  * Title
* Filter by reading status
* Filter by tags

### 🏷️ Tag Management

* Dynamic tag creation
* Many-to-many relationship between books and tags
* Edit and update tags
* Tag-based filtering

### 📊 Dashboard

* Library statistics
* Average rating
* Books by status
* Highest rated book
* Interactive charts using Chart.js

### 🎨 User Interface

* Responsive design
* Dark / Light mode
* Modern homepage
* Book cards with cover images
* Custom error pages

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* EJS
* Chart.js

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### APIs

* Open Library Covers API

### Authentication

* Express Session
* bcrypt

---

## 📂 Project Structure

```text
book-vault/
│
├── controllers/
├── routes/
├── middleware/
├── database/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── views/
├── .env
├── package.json
├── README.md
└── index.js
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/book-vault.git
```

Navigate to the project

```bash
cd book-vault
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
DB_USER=your_username
DB_HOST=localhost
DB_DATABASE=bookvault
DB_PASSWORD=your_password
DB_PORT=5432

SESSION_SECRET=your_secret
```

Run the SQL schema to create the database.

Start the server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 📸 Screenshots

* Home Page
* Library
* Book Details
* Dashboard
* Login
* Dark Mode

---

## 🔮 Future Improvements

* Deployment on Render
* User registration
* Password reset
* Email verification
* Recommendation engine
* Admin dashboard

---

## 👨‍💻 Author

Abhinav Gangwar

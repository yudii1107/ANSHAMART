# 🛍️ AnshaMart

### Full-Stack E-Commerce Website

AnshaMart is a full-stack e-commerce web application built to simulate a real-world online shopping platform. It includes product browsing, authentication, shopping cart, wishlist, reviews, checkout, and order management with a PostgreSQL-powered backend.

<p align="center">
  <strong>Built with HTML • CSS • JavaScript • Node.js • Express.js • PostgreSQL</strong>
</p>

---

## ✨ Features

### 🛒 Shopping

* Browse products across multiple categories
* Search products
* Filter by category
* Sort products by price
* View detailed product information
* Add products to cart
* Update cart quantities
* Remove products from cart

### 👤 User Account

* User registration
* Secure password hashing
* User login
* Authentication
* Profile management
* Logout functionality

### ❤️ Wishlist & Reviews

* Add and remove wishlist products
* Write product reviews
* View customer reviews

### 📦 Orders

* Checkout process
* Order creation
* Order history
* Order details
* Payment method selection

### 🗄️ Backend & Database

* RESTful API architecture
* Express.js backend
* PostgreSQL database
* CRUD operations
* Authentication middleware
* Product, user, order, review and wishlist APIs

---

## 🧰 Tech Stack

| Layer          | Technologies                 |
| -------------- | ---------------------------- |
| Frontend       | HTML5, CSS3, JavaScript      |
| Backend        | Node.js, Express.js          |
| Database       | PostgreSQL                   |
| API            | REST APIs                    |
| Authentication | Password Hashing             |
| Development    | VS Code, Git, GitHub         |
| Testing        | Browser DevTools, PowerShell |

---

## 🏗️ Project Structure

```text
ANSHAMART/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── reviews.js
│   │   └── wishlist.js
│   │
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── auth-state.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── orders.js
│   │   ├── product-details.js
│   │   ├── products.js
│   │   ├── profile.js
│   │   ├── reviews.js
│   │   ├── shop.js
│   │   └── wishlist.js
│   │
│   ├── index.html
│   ├── products.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── orders.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   └── wishlist.html
│
├── .gitignore
└── README.md
```

---

## 🔄 Application Flow

```text
        ┌───────────────┐
        │    Frontend   │
        │ HTML/CSS/JS   │
        └───────┬───────┘
                │
                │ REST API
                ▼
        ┌───────────────┐
        │    Express    │
        │    Backend    │
        └───────┬───────┘
                │
                │ SQL
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        │    Database   │
        └───────────────┘
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yudii1107/ANSHAMART.git
cd ANSHAMART
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure PostgreSQL

Create a PostgreSQL database:

```text
ecommerce_db
```

Create a `.env` file inside the `backend` directory and configure your local PostgreSQL credentials.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_password
```

> Keep your `.env` file private. It is excluded from Git using `.gitignore`.

### 4. Start the backend

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

### 5. Start the frontend

From the `frontend` directory:

```bash
npx serve -l 3000
```

Frontend:

```text
http://localhost:3000
```

---

## 🔌 API Endpoints

### Products

```text
GET    /api/products
GET    /api/products/:id
```

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
```

### Orders

```text
POST   /api/orders
GET    /api/orders
```

### Reviews

```text
GET    /api/reviews/:productId
POST   /api/reviews
```

### Wishlist

```text
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
```

---

## 📸 Project Preview

Website Looks like

<img width="1896" height="902" alt="Screenshot 2026-09-19 032706" src="https://github.com/user-attachments/assets/1495a670-5fa4-4c9b-8740-e1fb58078b29" />
<img width="1878" height="902" alt="Screenshot 2026-09-19 032945" src="https://github.com/user-attachments/assets/30fb35b1-695c-46ef-bd3e-355bffea0ea9" />
<img width="1880" height="900" alt="Screenshot 2026-09-19 032804" src="https://github.com/user-attachments/assets/891c8a67-dab7-4813-b68a-8cc4d0d6ab70" />
<img width="1895" height="906" alt="Screenshot 2026-09-19 032734" src="https://github.com/user-attachments/assets/3d14980c-d275-4684-ab42-537a95197b83" />


---

## 🎯 Project Goals

The project was developed to gain practical experience with:

* Full-stack web development
* REST API development
* Database integration
* Authentication
* CRUD operations
* E-commerce workflows
* Client-server communication
* Git and GitHub
* Frontend UI development

---

## 🔮 Future Improvements

Possible future enhancements include:

* Online payment gateway
* Admin dashboard
* Product management panel
* Order status tracking
* Product ratings
* Advanced filtering
* Pagination
* Image upload system
* Deployment with a cloud database

---

## 👨‍💻 Author

### Yudhishthir

**B.Tech Computer Science & Engineering Student**

Interested in Full-Stack Development and building practical web applications.

---

## 📄 License

This project is created for educational and portfolio purposes.

---

<p align="center">
  ⭐ If you find this project interesting, consider giving the repository a star!
</p>

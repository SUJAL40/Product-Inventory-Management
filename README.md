# 🌿 Lakadi Ghana — Full-Stack Product & Inventory Management

A modern, production-grade full-stack web application built with **Angular (Frontend)** and **Spring Boot 3 (Backend)**, designed for managing wood-pressed oils, organic foods, wooden crafts, and general retail inventory.

---

## 🏗️ Architecture & Tech Stack

```
Demo Project/
├── backend/                  # Spring Boot 3.4.3 REST API (Java 21)
│   ├── src/main/java/        # Entities, Repositories, Services, Controllers, DTOs
│   ├── src/main/resources/   # application.properties (H2 & MySQL templates)
│   └── pom.xml               # Maven configuration
├── frontend/                 # Angular Standalone Architecture
│   ├── src/app/
│   │   ├── components/       # Dashboard, Product List, Form, Detail, Categories
│   │   ├── services/         # REST API clients & Notification services
│   │   ├── models/           # TypeScript interfaces & DTOs
│   │   └── shared/           # Toast notifications & Modals
│   └── package.json
└── README.md
```

### **Backend (Spring Boot 3.4.3)**
- **Java 21**
- **Spring Boot Starter Web** (REST API)
- **Spring Boot Starter Data JPA** & **Hibernate**
- **H2 In-Memory Database** (with Web Console enabled at `/h2-console`)
- **Jakarta Validation** (`@Valid`, custom error handling)
- **CORS Configured** for Angular (`http://localhost:4200`)
- **Data Initializer** pre-populating realistic demo products and categories

### **Frontend (Angular)**
- **Modern Standalone Components** (No NgModules boilerplate)
- **Angular Router** with lazy routing & component binding
- **HttpClient with Fetch backend**
- **Reactive Forms** with live validation
- **Modern Responsive CSS Design System** (Plus Jakarta Sans, cards, modals, toast alerts)

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java JDK 21+** (e.g. Oracle JDK or OpenJDK 21)
- **Apache Maven 3.9+**
- **Node.js (v18+)** and **npm**

---

### 1️⃣ Run the Spring Boot Backend

Open a terminal in the `backend` folder:

```powershell
cd backend
mvn spring-boot:run
```

The backend server will start on: **`http://localhost:8081`**

- **REST API Base URL**: `http://localhost:8081/api`
- **H2 Database Web Console**: `http://localhost:8081/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:inventorydb`
  - **Username**: `sa`
  - **Password**: `password`

---

### 2️⃣ Run the Angular Frontend

Open a new terminal in the `frontend` folder:

```powershell
cd frontend
npm start
```

Open your browser and navigate to: **`http://localhost:4200`**

---

## 📡 REST API Endpoints

### 📦 Products (`/api/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products (supports `?search=...&categoryId=...`) |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}` | Update existing product |
| `PATCH` | `/api/products/{id}` | Quick stock adjustment (`{ "delta": 1 }` or `{ "delta": -1 }`) |
| `DELETE` | `/api/products/{id}` | Delete product |

### 🏷️ Categories (`/api/categories`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Get all categories with product counts |
| `GET` | `/api/categories/{id}` | Get category by ID |
| `POST` | `/api/categories` | Create category |
| `PUT` | `/api/categories/{id}` | Update category |
| `DELETE` | `/api/categories/{id}` | Delete category (safely prevents deleting categories with linked items) |

### 📊 Dashboard Metrics (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated metrics: total products, low stock, out of stock, total inventory valuation, category breakdown |

---

## 💡 Key Features Included

1. **Live Inventory Dashboard**: Real-time KPI cards for total items, total valuation (₹), low-stock warnings, and category progress bars.
2. **Comprehensive Product Catalog**:
   - Instant search across name, SKU, and descriptions.
   - Filter by Category and Stock Level (In Stock, Low Stock, Out of Stock).
   - Multi-field sorting (Price High/Low, Quantity High/Low, Name).
   - Table View and Responsive Grid Card View.
3. **One-Click Quick Restock**: Increase/decrease stock directly from product tables or cards with instant updates.
4. **Product Form & Validation**: Automatic SKU generator, dynamic image previews, and field-level validation.
5. **Category Management**: Create, update, and manage categories with linked product tracking.
6. **Toast Notification System**: Real-time floating alerts for all CRUD operations.

---

## 🛠️ Switching to MySQL (Optional)

If you'd like to use a persistent MySQL database instead of H2:
1. Ensure MySQL is running locally on port 3306.
2. Edit `backend/src/main/resources/application-mysql.properties` with your database credentials.
3. Start the backend with the `mysql` profile:
   ```powershell
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

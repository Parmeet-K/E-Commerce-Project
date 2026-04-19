# 🛒 E-Commerce Website (React + Redux)

## 📌 Project Description

This project is a simple **E-commerce web application** built using **React and Redux Toolkit**.
It allows users to browse products, add them to a cart, authenticate, and place orders.

The goal of this project is to demonstrate core concepts of modern frontend development such as **state management, routing, and component-based architecture**.

---

## 🚀 Features

* 🔐 **User Authentication**

  * Login functionality using Redux
  * Protected routes for checkout and orders

* 🛍️ **Product Catalog**

  * Displays list of products
  * Search functionality to filter products

* 🛒 **Cart Management**

  * Add items to cart
  * Increase quantity automatically
  * Remove items from cart

* 💳 **Checkout System**

  * Place orders from cart items

* 📦 **Order History**

  * View previously placed orders

---

## 🛠️ Tech Stack

* **Frontend:** React
* **State Management:** Redux Toolkit
* **Routing:** React Router DOM
* **Styling:** CSS

---

## 📂 Project Structure

```
src/
│
├── app/
│   └── store.js
│
├── components/
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
│
├── features/
│   ├── auth/
│   │   └── authSlice.js
│   ├── cart/
│   │   └── cartSlice.js
│   ├── products/
│   │   └── productSlice.js
│   └── orders/
│       └── orderSlice.js
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   └── Orders.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## ⚙️ Installation & Setup

1. Clone the repository:

```
git clone https://github.com/your-username/ecommerce-project.git
```

2. Navigate to project folder:

```
cd ecommerce-project
```

3. Install dependencies:

```
npm install
```

4. Run the project:

```
npm run dev
```

---

## 🧠 Key Concepts Used

* Redux global state management
* React Hooks (`useState`, `useSelector`, `useDispatch`)
* Protected routing
* Component-based architecture
* Conditional rendering

---

## 📸 Screenshots

<img width="1884" height="1006" alt="image" src="https://github.com/user-attachments/assets/de2dead2-5be7-4c80-a17e-0e5b2dbb1d8d" />


---

## 🎯 Future Improvements

* Add product images
* Integrate real backend (Node.js / Firebase)
* Payment gateway integration
* Improve UI with Tailwind CSS
* Add user signup system

---

## 📄 License

This project is for educational purposes only.

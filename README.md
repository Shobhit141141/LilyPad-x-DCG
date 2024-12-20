# LilyPad-x-DCG

This project is a dynamic web application for **Lilypad**, a company specializing in electric 2-wheelers. The application allows users to dynamically manage product data, including creating, reading, updating, and deleting product details. It is built using **React**, **Node.js**, and **MongoDB**.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)

---

## Features

- **Dynamic Product Management**:
  - Add new products with detailed information such as name, price, stock status, and specifications.
  - Edit or update existing product details.
  - Delete products.
- **Validation**:
  - Ensures that required fields are filled out before submission.
- **Toast Notifications**:
  - Success and error messages for user actions.
- **Responsive Design**:
  - Optimized for both desktop and mobile views.

---

## Tech Stack

- **Frontend**:
  - React
  - Axios for API requests
  - React Hot Toast for notifications
- **Backend**:
  - Node.js
  - Express
- **Database**:
  - MongoDB (NoSQL database)

---

## Installation

1. **Clone the Repository**

2. **Install Dependencies**
   - Navigate to the `frontend` and `backend` directories separately and install the dependencies.


3. **Environment Variables**
   - Create a `.env` file in the `backend` directory and configure the following:

4. **Run the Application**
   - Start the backend server:

   - Start the frontend development server:
  

---

## Usage

1. Navigate to the website.
2. Add a new product by filling out the dynamic input form.
3. View the list of products dynamically fetched from the database.
4. Update or delete product information as needed.

---

## API Endpoints

The backend API exposes the following endpoints:

- **POST** `/api/product`
  - Add a new product.

- **GET** `/api/products`
  - Fetch all products.

- **GET** `/api/product/:id`
  - Fetch a single product by ID.

- **PUT** `/api/product/:id`
  - Update a product by ID.
  - **Body Parameters**: Same as `POST` `/api/product`.

- **DELETE** `/api/product/:id`
  - Delete a product by ID.

---

## Folder Structure

```
root
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── .env
│   ├── index.js
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.js
│   │   ├── index.js
├── README.md
```

---


### Acknowledgments

Special thanks to the Lilypad team for providing the opportunity to build this project. 🚀


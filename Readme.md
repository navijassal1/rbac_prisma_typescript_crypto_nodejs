# Project Name

A CRUD application using **TypeScript**, **Prisma**, and **MariaDB**, featuring **token-based authentication** with **Crypto** and **role-based access control (RBAC)**.

---

## Table of Contents

- [About the Project](#about-the-project)  
- [Technologies Used](#technologies-used)  
- [Features](#features)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Environment Variables](#environment-variables)  
  - [Running the Project](#running-the-project)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)

---

## About the Project

This project is a **CRUD (Create, Read, Update, Delete) application** built with **TypeScript** and **Prisma**. It uses **MariaDB** as the database and implements:

- **Token-based authentication** using **Crypto** for secure token generation  
- **Role-Based Access Control (RBAC)** for managing user permissions  
- Clean and scalable code structure using TypeScript  

---

## Technologies Used

- **TypeScript** – Strongly typed JavaScript for safer and cleaner code  
- **Prisma** – Modern ORM for database access  
- **MariaDB** – Relational database  
- **Node.js & Express** – Backend server and routing  
- **Crypto** – For secure token creation  
- **JWT (JSON Web Token)** – For authentication  

---

## Features

- User registration and login  
- Secure token-based authentication  
- Role-based access control for routes  
- CRUD operations on resources  
- Database management using Prisma ORM  

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)  
- [MariaDB](https://mariadb.org/)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  

---

## Project Setup

Follow these commands to set up the project from scratch:

```bash
# Initialize npm project
npm init -y

# Install TypeScript and Node.js types
npm install typescript tsx @types/node --save-dev

# Install Prisma as a development dependency
npm install prisma --save-dev

# Install Prisma Client, MariaDB adapter, and dotenv
npm install @prisma/client @prisma/adapter-mariadb dotenv

# Initialize Prisma CLI
npx prisma

# Initialize Prisma project with MySQL as the datasource and custom output folder
npx prisma init --datasource-provider mysql --output ../generated/prisma

# Apply database migrations (creates tables)
npx prisma migrate dev

# Generate Prisma client
npx prisma generate


# Reset Prisma 
npx prisma migrate reset





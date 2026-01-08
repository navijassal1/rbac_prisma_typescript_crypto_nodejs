# Project Name

A short description of your project (e.g., "A TypeScript backend with Prisma and MariaDB").

---

## Table of Contents

- [Project Setup](#project-setup)  
- [Environment Variables](#environment-variables)  
- [Database Setup](#database-setup)  
- [Scripts](#scripts)  
- [Running the Project](#running-the-project)  
- [Prisma Commands](#prisma-commands)  
- [License](#license)

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





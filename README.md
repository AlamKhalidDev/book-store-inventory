# 📚 Library & Bookstore Inventory System

A Node.js + TypeScript backend service for managing library/bookstore inventory, user borrow/buy actions, and financial tracking via a wallet system.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **PostgreSQL** + Prisma ORM
- **Jest** for testing
- **Docker** (optional)
- **Nodemailer** email simulation

---

## 📦 Features

### ✅ Admin Capabilities (`admin@dummy-library.com` via `x-user-email` header)

- Search books by title, author, or genre
- View book details and activity logs
- Monitor wallet balance and transaction history
- Get user borrow/buy summaries
- Restock notifications when book copies drop to 1
- Wallet milestone email when balance exceeds $2000

### ✅ User Capabilities (`x-user-email` header as any other email)

- Borrow up to 3 different books (1 copy per book)
- Return borrowed books
- Buy up to 2 copies per book (10 total across books)
- Get reminder after 3 days for unreturned books

---

## 🗃️ Project Structure

```bash
src/
├── controllers/    # Route controllers
├── routes/         # Express routers
├── middlewares/    # Admin check, user injection
├── utils/          # Email sender, schedulers
├── tests/          # Test cases
🔧 Setup Instructions
1. Clone & Install

git clone https://github.com/AlamKhalidDev/book-store-inventory.git
cd book-store-inventory
npm install
2. Configure Environment
Create a .env file:

env
DATABASE_URL=postgresql://user:password@localhost:5432/book_store_inventory

NODEMAILER_HOST=smtp host
NODEMAILER_PORT=port from smtp server
NODEMAILER_USER=smtp user
NODEMAILER_PASS=smtp password
NODEMAILER_EMAIL=email associated with smtp service

3. Prisma Setup

npx prisma generate
npx prisma migrate dev --name init
4. Seed the Database

npm run seed
5. Run the Server

npm run dev
Server runs on http://localhost:3000

🧪 Running Tests

npm test
🐳 Docker (Optional)
Build and run:

Build the Docker image

docker build -t book-store-inventory .
Run the Docker container

docker-compose up
This will run the app and database inside Docker containers.


📬 Postman Collection
You can import the Postman collection from:

📁 postman/BookstoreAPI.postman_collection.json

📤 Sample Headers

Header	Description
x-user-email	User/admin email (required on all routes)
⚠️ Assumptions Made
No real authentication; identity is header-based.

Restocking and reminders are handled by scheduled cron-like processes.

Nodemailer used with Ethereal for simulated email delivery.

🔗 Live Demo
The project is hosted on Render at:

🌐 https://book-store-inventory-jn7w.onrender.com/

⚠️ Render may put the service to sleep when idle. The first request might take 20–30 seconds to spin it back up.

To wake it, simply make a request:


curl https://book-store-inventory-jn7w.onrender.com

```

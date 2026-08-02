# Personal Finance Tracker

A backend application for managing personal finances, built with **Node.js**, **Express.js**, **TypeScript**, **PostgreSQL**, **TypeORM**, **Redis**, and **Docker**. The application allows users to securely manage income and expenses, generate financial summaries, export transaction data, and improve performance through caching and scheduled background jobs.

## Features

- Secure user authentication with JWT
- User registration and login
- Create, update, delete, and view financial transactions
- Daily income, expense, and balance summaries
- Redis caching for improved API performance
- Export transaction history as CSV
- Automated daily summary generation using cron jobs
- Centralized logging with Winston
- Rate limiting and secure API endpoints
- Docker and Podman support
- CI/CD pipeline with GitHub Actions

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL
- TypeORM

### Caching
- Redis

### Authentication
- JWT
- bcrypt

### DevOps
- Docker
- Podman
- GitHub Actions

### Other Tools
- Winston
- Node Cron
- json2csv

## Project Structure

```text
src/
├── config/
├── controllers/
├── cron/
├── entities/
├── middleware/
├── routes/
├── services/
├── utils/
└── index.ts
```

## Key Highlights

- RESTful API built using Express.js and TypeScript
- Secure authentication and authorization using JWT
- Efficient data persistence with PostgreSQL and TypeORM
- Redis caching to reduce database load and improve response times
- Automated background jobs for daily financial summaries
- CSV export functionality for transaction records
- Containerized deployment using Docker and Podman
- Automated CI/CD workflow using GitHub Actions

## Future Enhancements

- Monthly and yearly financial analytics
- Budget planning and spending alerts
- Expense categorization
- Interactive dashboard
- Email notifications
- API documentation with Swagger

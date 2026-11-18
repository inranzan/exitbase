# Exitbase Backend

Exitbase is the backend API for a marketplace platform to buy and sell SaaS applications and digital startups.

## Tech Stack

- **Runtime**: Node.js 22
- **Framework**: Express 5
- **Database**: PostgreSQL on Neon (Serverless via HTTP driver)
- **ORM**: Drizzle ORM
- **Security**: Arcjet, Helmet, CORS
- **Auth**: JWT & bcrypt
- **Validation**: Zod
- **Containers**: Docker & Docker Compose (Neon Local)

## Quick Start

### 1. Local Development (with Neon Local)

Automatically via Docker:

```bash
./scripts/dev.sh
```

_Or run locally:_

```bash
npm install
npm run dev
```

### 2. Production Deployment

Direct connection to Neon Cloud:

```bash
./scripts/prod.sh
```

## API Documentation

Detailed endpoint guides with request/response sample payloads are available in the [`docs/`](./docs) folder:

- [Overview & Setup](./docs/overview.md)
- [Authentication API](./docs/auth.md)
- [Users API](./docs/users.md)
- [SaaS Listings API](./docs/saas.md)

## API Endpoints

### System

| Method | Endpoint  | Description                     | Auth   |
| :----- | :-------- | :------------------------------ | :----- |
| `GET`  | `/health` | Server uptime and health status | Public |
| `GET`  | `/api`    | Base API running confirmation   | Public |

### Authentication (`/api/auth`)

| Method | Endpoint           | Description                          | Auth   |
| :----- | :----------------- | :----------------------------------- | :----- |
| `POST` | `/api/auth/signup` | Register a new user account          | Public |
| `POST` | `/api/auth/login`  | Log in and receive auth cookie/token | Public |
| `POST` | `/api/auth/logout` | Clear auth session cookie            | Public |

### Users (`/api/users`)

| Method   | Endpoint         | Description                        | Auth            |
| :------- | :--------------- | :--------------------------------- | :-------------- |
| `GET`    | `/api/users/`    | List all registered users          | Public          |
| `GET`    | `/api/users/me`  | Get current logged-in user profile | Bearer / Cookie |
| `GET`    | `/api/users/:id` | Get single user profile by ID      | Bearer / Cookie |
| `PUT`    | `/api/users/:id` | Update profile (Owner or Admin)    | Bearer / Cookie |
| `DELETE` | `/api/users/:id` | Delete account (Owner or Admin)    | Bearer / Cookie |

### SaaS Listings (`/api/saas` or `/api/listings`)

| Method   | Endpoint        | Description                      | Auth            |
| :------- | :-------------- | :------------------------------- | :-------------- |
| `GET`    | `/api/saas`     | List all startups/saas for sale  | Public          |
| `GET`    | `/api/saas/:id` | View single saas listing details | Public          |
| `POST`   | `/api/saas`     | List a new startup/saas for sale | Bearer / Cookie |
| `PUT`    | `/api/saas/:id` | Update listing (Owner or Admin)  | Bearer / Cookie |
| `DELETE` | `/api/saas/:id` | Delete listing (Owner or Admin)  | Bearer / Cookie |

## Environment Variables

Copy template to configure:

- **Development**: `.env.development` (Points to `postgres://...neon-local:5432/...`)
- **Production**: `.env.production` (Points to Neon Cloud URL `postgresql://...neon.tech?sslmode=require`)

Key variables: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `ARCJET_KEY`, `ARCJET_PROJECT_ID`.

## CI/CD Workflows

- **`.github/workflows/lint-format.yml`**: Runs ESLint and Prettier checks on push/PR.
- **`.github/workflows/docker-build-push.yml`**: Builds and pushes production image to Docker Hub.

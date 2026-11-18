# Overview

Exitbase API documentation for buying and selling SaaS applications and digital startups.

## Base URLs

- **Local**: `http://localhost:5000`
- **Docker**: `http://localhost:5000`

## Authentication

Protected endpoints require a JWT token via either:

1. **Authorization Header**:
    ```http
    Authorization: Bearer <token>
    ```
2. **HTTP-only Cookie**:
   Automatically set on `/api/auth/sign-up` and `/api/auth/login` as `token`.

## Response Formats

### Success

```json
{
    "message": "Operation successful",
    "data": {}
}
```

### Error

```json
{
    "error": "Error type",
    "message": "Error description"
}
```

### Validation Error

```json
{
    "error": "Validation Error",
    "details": "field must be at least 2 characters"
}
```

## System Endpoints

### Health Check

`GET /health`

```json
{
    "status": "OK",
    "timestamp": "2026-11-18T12:00:00.000Z",
    "uptime": 124.5
}
```

### API Status

`GET /api`

```json
{
    "status": "OK",
    "message": "Exitbase API is running."
}
```

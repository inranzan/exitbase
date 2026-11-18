# Authentication Endpoints

Base path: `/api/auth`

## 1. Sign Up

Register a new user account. Sets an HTTP-only cookie and returns JWT token.

- **Method**: `POST`
- **URL**: `/api/auth/sign-up`

### Request Body

```json
{
    "name": "ranzan",
    "email": "rn@exitbase.com",
    "password": "Password123!",
    "role": "user"
}
```

_Note: `role` is optional and defaults to `"user"`._

### Response `201 Created`

```json
{
    "message": "User registered successfully.",
    "user": {
        "id": 1,
        "name": "ranzan",
        "email": "rn@exitbase.com",
        "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses

- `400 Bad Request`: Validation failure.
- `409 Conflict`:

```json
{
    "error": "User with this email already exists."
}
```

## 2. Login

Authenticate an existing user.

- **Method**: `POST`
- **URL**: `/api/auth/login`

### Request Body

```json
{
    "email": "rn@exitbase.com",
    "password": "Password123!"
}
```

### Response `200 OK`

```json
{
    "message": "Login successful.",
    "user": {
        "id": 1,
        "name": "ranzan",
        "email": "rn@exitbase.com",
        "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses

- `400 Bad Request`: Validation failure.
- `401 Unauthorized`:

```json
{
    "error": "Invalid email or password."
}
```

## 3. Logout

Clears the session cookie.

- **Method**: `POST`
- **URL**: `/api/auth/logout`

### Response `200 OK`

```json
{
    "message": "Logged out successfully."
}
```

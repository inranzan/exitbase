# Users Endpoints

Base path: `/api/users`

## 1. List All Users

Returns a list of all registered users without passwords.

- **Method**: `GET`
- **URL**: `/api/users`

### Response `200 OK`

```json
{
    "message": "Success getting all users.",
    "users": [
        {
            "id": 1,
            "name": "ranzan",
            "email": "rn@exitbase.com",
            "role": "user",
            "created_at": "2026-11-18T10:00:00.000Z",
            "updated_at": "2026-11-18T10:00:00.000Z"
        }
    ],
    "count": 1
}
```

## 2. Get Current Profile

Returns the logged-in user's profile.

- **Method**: `GET`
- **URL**: `/api/users/me`
- **Auth**: Required (`Bearer <token>` or cookie)

### Response `200 OK`

```json
{
    "user": {
        "id": 1,
        "name": "ranzan",
        "email": "rn@exitbase.com",
        "role": "user",
        "created_at": "2026-11-18T10:00:00.000Z",
        "updated_at": "2026-11-18T10:00:00.000Z"
    }
}
```

## 3. Get User By ID

Fetch user details by ID.

- **Method**: `GET`
- **URL**: `/api/users/:id`
- **Auth**: Required (`Bearer <token>` or cookie)

### Response `200 OK`

```json
{
    "user": {
        "id": 1,
        "name": "ranzan",
        "email": "rn@exitbase.com",
        "role": "user",
        "created_at": "2026-11-18T10:00:00.000Z",
        "updated_at": "2026-11-18T10:00:00.000Z"
    }
}
```

### Error Responses

- `400 Bad Request`: Invalid user ID format.
- `404 Not Found`:

```json
{
    "error": "Not Found",
    "message": "User not found."
}
```

## 4. Update User

Update user account name, email, or password. Only allowed for the account owner or an admin.

- **Method**: `PUT`
- **URL**: `/api/users/:id`
- **Auth**: Required (`Bearer <token>` or cookie)

### Request Body (all fields optional)

```json
{
    "name": "ranzan",
    "email": "rnzn@exitbase.com",
    "password": "NewPassword123!"
}
```

### Response `200 OK`

```json
{
    "message": "User updated successfully.",
    "user": {
        "id": 1,
        "name": "ranzan",
        "email": "rnzn@exitbase.com",
        "role": "user",
        "created_at": "2026-11-18T10:00:00.000Z",
        "updated_at": "2026-11-18T12:00:00.000Z"
    }
}
```

### Error Responses

- `403 Forbidden`:

```json
{
    "error": "Forbidden",
    "message": "You are not authorized to update this user account."
}
```

- `409 Conflict`: Email already in use.

## 5. Delete User

Delete a user account. Only allowed for the account owner or an admin.

- **Method**: `DELETE`
- **URL**: `/api/users/:id`
- **Auth**: Required (`Bearer <token>` or cookie)

### Response `200 OK`

```json
{
    "message": "User account deleted successfully."
}
```

### Error Responses

- `403 Forbidden`: Unauthorized user.
- `404 Not Found`: User not found.

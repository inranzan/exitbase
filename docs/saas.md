# SaaS Listings Endpoints

Base path: `/api/saas` (Alias: `/api/listings`)

## 1. List All SaaS Startups

Returns all SaaS and startup listings sorted newest first with seller details.

- **Method**: `GET`
- **URL**: `/api/saas`

### Response `200 OK`

```json
{
    "message": "success getting all saas listings.",
    "listings": [
        {
            "id": 1,
            "name": "exitbase",
            "url": "https://exitbase.com",
            "description": "Exit space for saas and startups.",
            "revenue": "2400.00",
            "created_at": "2026-11-18T10:00:00.000Z",
            "updated_at": "2026-11-18T10:00:00.000Z",
            "seller": {
                "id": 1,
                "name": "ranzan",
                "email": "rn@exitbase.com"
            }
        }
    ],
    "count": 1
}
```

---

## 2. Get Single SaaS Listing

Fetch single SaaS listing by ID.

- **Method**: `GET`
- **URL**: `/api/saas/:id`

### Response `200 OK`

```json
{
    "listing": {
        "id": 1,
        "name": "exitbase",
        "url": "https://exitbase.com",
        "description": "Exit space for saas and startups.",
        "revenue": "2400.00",
        "created_at": "2026-11-18T10:00:00.000Z",
        "updated_at": "2026-11-18T10:00:00.000Z",
        "seller": {
            "id": 1,
            "name": "ranzan",
            "email": "rn@exitbase.com"
        }
    }
}
```

### Error Responses

- `400 Bad Request`: Invalid ID format.
- `404 Not Found`:

```json
{
    "error": "not found",
    "message": "saas listing not found."
}
```

---

## 3. Create SaaS Listing

List a new SaaS startup for sale.

- **Method**: `POST`
- **URL**: `/api/saas`
- **Auth**: Required (`Bearer <token>` or cookie)

### Request Body

```json
{
    "name": "exitbase",
    "url": "https://exitbase.com",
    "description": "Exit space for saas and startups.",
    "revenue": 2400
}
```

### Response `201 Created`

```json
{
    "message": "saas listed successfully.",
    "listing": {
        "id": 1,
        "user_id": 1,
        "name": "exitbase",
        "url": "https://exitbase.io",
        "description": "Exit space for saas and startups.",
        "revenue": "2400.00",
        "created_at": "2026-11-18T10:00:00.000Z",
        "updated_at": "2026-11-18T10:00:00.000Z"
    }
}
```

### Error Responses

- `400 Bad Request`: Validation failure (e.g. invalid URL, description too short, negative revenue).

---

## 4. Update SaaS Listing

Update a listing. Only allowed for the listing seller or an admin.

- **Method**: `PUT` or `PATCH`
- **URL**: `/api/saas/:id`
- **Auth**: Required (`Bearer <token>` or cookie)

### Request Body (all fields optional)

```json
{
    "name": "exitbase",
    "revenue": 3200
}
```

### Response `200 OK`

```json
{
    "message": "saas updated successfully.",
    "listing": {
        "id": 1,
        "user_id": 1,
        "name": "exitbase",
        "url": "https://exitbase.com",
        "description": "Exit space for saas and startups.",
        "revenue": "3200.00",
        "created_at": "2026-11-18T10:00:00.000Z",
        "updated_at": "2026-11-18T12:00:00.000Z"
    }
}
```

### Error Responses

- `403 Forbidden`:

```json
{
    "error": "forbidden",
    "message": "you are not authorized to update this listing."
}
```

- `404 Not Found`: Listing not found.

---

## 5. Delete SaaS Listing

Delete a listing. Only allowed for the listing seller or an admin.

- **Method**: `DELETE`
- **URL**: `/api/saas/:id`
- **Auth**: Required (`Bearer <token>` or cookie)

### Response `200 OK`

```json
{
    "message": "saas listing deleted successfully."
}
```

### Error Responses

- `403 Forbidden`:

```json
{
    "error": "forbidden",
    "message": "you are not authorized to delete this listing."
}
```

- `404 Not Found`: Listing not found.

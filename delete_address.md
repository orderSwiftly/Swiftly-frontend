Here's your markdown:

---

## Delete Address Endpoint

### Endpoint

```
DELETE /api/v1/user/address/:addressId
```

> Requires authentication.

---

### How It Works

Pass the `_id` of the address you want to delete as a URL parameter. The backend will remove that specific address from the user's address list. All other addresses remain untouched.

---

### Request

**URL Parameter**

| Param | Type | Description |
|---|---|---|
| `addressId` | `string` | The `_id` of the address to delete |

**Headers**

| Key | Value |
|---|---|
| `Authorization` | `Bearer <token>` |

No request body needed.

---

### Response

**200 OK** — returns the updated address array after deletion.

```json
{
  "status": "success",
  "data": {
    "address": [
      {
        "_id": "...",
        "building": "Winslow",
        "room": "C20",
        "institutionId": null
      }
    ]
  }
}
```

**404** — user not found.

---

### Example

```
DELETE /api/v1/user/address/69fe863d6d841e63c17609c9
```
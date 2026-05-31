Here's your md:

---

## Order Pricing & Checkout – Express Delivery Update

---

### 1. Calculate Totals (New)

Use this before showing the checkout summary to get the full pricing breakdown including fees.

**`POST /api/v1/order/calculate-totals/:store_id`**

**Request body:**
```json
{
  "isExpressDelivery": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "pricing": {
      "subtotal": 240,
      "serviceFee": 50,
      "deliveryFee": 1200,
      "total": 1490
    }
  }
}
```

Call this whenever the user toggles express on or off so the summary reflects the correct fees before they proceed to pay. Express delivery fee is double the standard delivery fee.

---

### 2. Checkout (Updated)

No breaking changes — just add `isExpressDelivery` to the body you're already sending.

**`POST /api/v1/order/checkout/:store_id`**

**Request body:**
```json
{
  "addressId": "...",
  "building": "...",
  "room": "...",
  "isExpressDelivery": true
}
```

Everything else stays the same. `isExpressDelivery` is optional and defaults to `false`.
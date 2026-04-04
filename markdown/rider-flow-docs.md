# Rider Delivery Flow

## Order Status Progression
```
confirmed → shipped → awaiting_verification → verified → collected → delivered
```

---

## The Flow

### 1. Rider browses available orders
`GET /api/v1/rider/orders/shipped`

Rider sees all orders available for pickup (`shipped`). Paginated via `?page` and `?limit`. Orders the rider has previously been rejected from won't appear here.

---

### 2. Rider requests pickup
`POST /api/v1/rider/request/:order_id`

Rider picks an order and requests to pick it up. Order moves to `awaiting_verification`. The order is now locked to this rider and the **buyer gets a push notification** to verify the rider.

---

### 3. Buyer views rider details
`GET /api/v1/order/:order_id/rider`

Buyer sees the details of the rider who requested pickup — name, photo, etc. This is what the buyer uses to decide whether to accept or reject.

---

### 4a. Buyer accepts
`POST /api/v1/order/:order_id/rider/accept`

Buyer verifies the rider. Order moves to `verified`. **Rider gets a push notification** that they've been verified and can proceed to collect the order.

### 4b. Buyer rejects
`POST /api/v1/order/:order_id/rider/reject`

Buyer rejects the rider. Order moves back to `shipped` and goes back into the pool for other riders. The rejected rider won't see this order again. **Rider gets a push notification** that they've been declined.

---

### 5. Rider collects order
`POST /api/v1/rider/collect/:order_id`

Rider picks up the order from the seller. Order moves to `collected`.

---

### 6. Rider delivers order
`POST /api/v1/rider/deliver/:order_id`

Rider delivers the order to the buyer. Order moves to `delivered`.

---

## Other Endpoints

**Active orders** — `GET /api/v1/rider/orders/active`  
All in-flight orders for the rider. Covers everything from `awaiting_verification` through `verified` to `collected` — i.e. anything that hasn't been delivered yet.

**Delivered orders** — `GET /api/v1/rider/orders/delivered`  
Paginated history of the rider's delivered orders. Supports `?page` and `?limit`. Response includes `meta.total` and `meta.totalPages`.

**Rider profile** — `GET /api/v1/rider`  
Returns the authenticated rider's profile details.

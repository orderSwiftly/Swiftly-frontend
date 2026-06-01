Here's your md:

---

## Institution & Address Update – Frontend Integration Notes

Hey team, a few more changes across cart, addresses and orders. Details below.

---

### Cart

**`GET /api/v1/cart/institution/:institution_enum`**

The get cart endpoint has been updated. Pass the `institutionEnum` as a path parameter — it will return only cart items belonging to that institution.

The old `/api/v1/cart/get` is gone. Update all calls to use the new route.

---

### Addresses

Two address endpoints now instead of one.

**`GET /api/v1/user/address`** — unchanged. Returns all addresses for the user regardless of institution. Use this on the manage addresses page.

**`GET /api/v1/user/address/:institution_enum`** — new. Returns only addresses for the given institution. Use this on the checkout page when prompting the user to pick a delivery address.

**`POST /api/v1/user/add-address`** — updated. `institutionEnum` is now required in the request body:

```json
{
  "building": "Winslow",
  "room": "C20",
  "institutionEnum": "UNILAG"
}
```

**`DELETE /api/v1/user/address/:addressId`** — unchanged.

---

### Orders

Both order endpoints now return an `institution` field.

**`GET /api/v1/order/get-orders`** — `institution` is now included in each order object in the response.

**`GET /api/v1/order/get-order/:id`** — same, `institution` is included in the order object.

You can use this to group or label orders by institution on the orders page.

---

### Summary

- Cart is now fetched per institution via `/api/v1/cart/institution/:institution_enum`
- Address creation now requires `institutionEnum` in the body
- Use `/api/v1/user/address/:institution_enum` at checkout, `/api/v1/user/address` on the manage page
- `institution` is now present on all order responses
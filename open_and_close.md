Here's your markdown:

---

## Store Open/Closed Status – Frontend Integration Notes

Hey team, a few backend changes have landed around store open/closed status. No endpoint changes on your end — everything is already being returned, you just need to start using it.

---

### `is_open` is already in every response

Every product-returning endpoint already includes `is_open` on the seller/store object. Here's where it shows up:

**Explore** (`GET /api/v1/product/explore/:institution_enum`)
```json
"seller": {
  "_id": "...",
  "businessName": "Unilag Eats",
  "logo": null,
  "is_open": false
}
```

**Search** (`GET /api/v1/product/search/:institution_enum`)
— same shape as explore above

**Single Product** (`GET /api/v1/product/explore/product/:id`)
— same shape as explore above

**Cart** (`GET /api/v1/cart/get`)
```json
"seller": {
  "_id": "...",
  "name": "Unilag Eats",
  "is_open": false
}
```

> Note: the cart response uses `name` instead of `businessName` — just a minor shape difference between the two.

---

### What to do with `is_open`

- On product cards and the explore/search listing, you can badge or grey out stores that are closed
- On the cart and checkout summary, if any store in the cart has `is_open: false`, you should block the checkout button and show something like *"This store is currently closed"* before the user even attempts to place the order — this saves them a failed payment attempt

---

### Checkout error messages

If a user somehow gets to checkout with a closed store, the backend will now return a clear error instead of a generic failure. The response will look like:

```json
{
  "title": "Store Closed",
  "status": 409,
  "detail": "Unilag Eats is currently closed and not accepting orders"
}
```

The `detail` field is human-readable and safe to surface directly in the UI.

The existing `insufficientStock` error is unchanged and still looks like:

```json
{
  "title": "Insufficient Stock",
  "status": 409,
  "detail": "One or more items in this sale do not have enough stock"
}
```

So for checkout errors you can key off the `title` field to decide what to show.

---

### Summary

- No endpoint changes needed
- Start reading `is_open` from the seller object across explore, search, single product, and cart
- Block checkout in the UI if any store is closed
- The `detail` field on `409` errors from checkout is now safe to show the user directly
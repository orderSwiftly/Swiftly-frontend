Here's your markdown:

---

## Dynamic Marketplace – Institution Filter Update

Hey team, quick heads-up on a change needed to support the new institution-based filtering in the marketplace.

---

### Context

The marketplace now supports dynamic filtering by institution. When a user searches or browses products, they can select an institution and the results will be scoped exclusively to that institution.

The institution list is fetched from the existing **get institutions endpoint** (you already know the route). Once a user selects an institution, it gets stored in `localStorage` in this shape:

```json
{
  "_id": "6a1716a4456c8992a97f1f21",
  "logo": "",
  "name": "Unilag",
  "address": {
    "city": "",
    "state": "Lagos State",
    "country": "Nigeria"
  },
  "createdAt": "2026-05-09T21:41:45.244Z",
  "institutionEnum": "UNILAG"
}
```

A new field `institutionEnum` has been added to this object — that's the one you'll be using.

---

### What Needs to Change

For both the **explore** and **search** product endpoints, append the `institutionEnum` value as a path parameter:

**Before:**

```
/api/v1/product/explore
/api/v1/product/search
```

**After:**

```
/api/v1/product/explore/${institutionEnum}
/api/v1/product/search/${institutionEnum}
```

Pull `institutionEnum` from the institution object stored in `localStorage` and slot it in. The backend handles all the filtering logic from there — no other changes needed on your end.

---

### Summary

- Read `institutionEnum` from the institution stored in `localStorage`
- Append it to the explore and search endpoint URLs
- That's it ✅

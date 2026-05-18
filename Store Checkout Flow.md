Here's what changed and what to update:

---

**What changed on the backend:**

The two endpoints (`/order/checkout/:storeId` and `/flutterwave/initialize/:orderId`) have been merged into one. Checkout now does everything — reserves stock, hits Flutterwave, and returns the payment link directly. One call, one redirect.

The new endpoint is:
```
POST /api/v1/order/checkout/:storeId
```
Same URL as before, same request body. But now the response returns `authorization_url` directly instead of `orderId`.

---

**New response shape:**
```json
{
  "status": "success",
  "data": {
    "authorization_url": "https://checkout.flutterwave.com/..."
  }
}
```

---

**Updated `checkoutStore` function:**

```typescript
export async function checkoutStore(
  storeId: string,
  address: CheckoutAddress
): Promise<{ authorization_url: string }> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await fetch(`${API_URL}/api/v1/order/checkout/${storeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });

  const data = await res.json();

  if (!res.ok || data.status !== 'success') {
    throw new Error(data.message || 'Checkout failed');
  }

  if (!data.data?.authorization_url) {
    throw new Error('Invalid response from server');
  }

  return data.data;
}
```

---

**Updated `handleSubmit`:**

```typescript
const handleSubmit = async () => {
  if (!storeData) {
    toast.error('No store data available');
    return;
  }
  setSubmitting(true);
  try {
    let addressPayload: { addressId?: string; building?: string; room?: string } = {};
    if (!useManual && selectedAddressId) {
      addressPayload = { addressId: selectedAddressId };
    } else if (useManual && building.trim() && room.trim()) {
      addressPayload = { building, room };
    } else {
      toast.error('Please select or enter a delivery address');
      setSubmitting(false);
      return;
    }

    const { authorization_url } = await checkoutStore(storeData.storeId, addressPayload);
    sessionStorage.removeItem('checkoutStoreId');
    window.location.href = authorization_url;
  } catch (err: unknown) {
    console.error(err);
    toast.error(err instanceof Error ? err.message : 'Checkout failed');
    router.push('/order/failure');
  } finally {
    setSubmitting(false);
  }
};
```

---

**`initPayment` is now dead — delete it.**

The button, the error handling, and the redirect all stay exactly the same. The only real change is one fewer network call and `initPayment` is gone.
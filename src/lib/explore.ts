import axios from 'axios';

export async function fetchExploreProducts(token?: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error('API URL not configured');
    }

    const res = await axios.get(`${apiUrl}/api/v1/product/explore`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    const data = res.data;

    if (data?.status !== 'success' || !Array.isArray(data.products)) {
        throw new Error(data?.message || 'Failed to fetch products');
    }

    return data.products;
}
import axios from 'axios';
export async function GetReviews(productId: string) {
    try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${api_url}/api/v1/review/product/${productId}`, {});
        return res.data.data.reviews || [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(err.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
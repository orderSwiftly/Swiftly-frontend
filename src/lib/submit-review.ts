import toast from "react-hot-toast";

export async function SubmitReview(
  productId: string,
  rating: number,
  comment: string
) {
  try {
    const token = localStorage.getItem("token");
    const api_url = process.env.NEXT_PUBLIC_API_URL;

    if (!token) {
      throw new Error("No authentication token found.");
    }

    const res = await fetch(
      `${api_url}/api/v1/review/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to submit review");

    toast.success("Review submitted successfully!");
    return data.data.review; // return review object
  } catch (err) {
    console.log((err as Error).message);
    toast.error((err as Error).message);
    throw err;
  }
}
import ReviewsClient from "./ReviewsClient";

export const metadata = {
  title: "Reviews - Cleaning Hub Dashboard",
  description: "Submit reviews for your services and view your review history.",
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
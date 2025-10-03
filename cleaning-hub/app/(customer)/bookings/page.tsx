import BookingsClient from "./BookingsClient";

export const metadata = {
  title: "My Bookings - Cleaning Hub Dashboard",
  description: "View and manage your cleaning service bookings, including upcoming appointments, history, and cancellation options.",
};

export default function BookingsPage() {
  return <BookingsClient />;
}
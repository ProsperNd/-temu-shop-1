import { Suspense } from "react";
import BookingClient from "./BookingClient";

export const metadata = {
  title: "Booking - Cleaning Hub | Schedule Your Cleaning Service",
  description: "Book your cleaning service with Cleaning Hub. Select service, date, time, and provide details to schedule your appointment.",
  keywords: "book cleaning service, schedule cleaning, cleaning appointment, house cleaning booking, office cleaning schedule",
  openGraph: {
    title: "Booking - Cleaning Hub",
    description: "Schedule your professional cleaning service easily online.",
    images: ["/og-booking.jpg"],
    url: "https://cleaninghub.com/booking",
  }
};

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingClient />
    </Suspense>
  );
}
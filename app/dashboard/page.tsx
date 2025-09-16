import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Customer Dashboard - Cleaning Hub",
  description: "Manage your bookings, profile, and loyalty rewards with Cleaning Hub.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
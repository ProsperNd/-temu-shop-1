import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard - Cleaning Hub",
  description: "Your customer dashboard - view bookings, loyalty points, and manage your account.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
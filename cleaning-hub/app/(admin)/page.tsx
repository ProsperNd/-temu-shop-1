import AdminClient from "./AdminClient";

export const metadata = {
  title: "Admin Dashboard - Cleaning Hub",
  description: "Administrative dashboard for managing bookings, customers, services, and analytics.",
};

export default function AdminPage() {
  return <AdminClient />;
}
import LoyaltyClient from "./LoyaltyClient";

export const metadata = {
  title: "Loyalty - Cleaning Hub Dashboard",
  description: "Manage your loyalty points, view rewards, and track your membership tier.",
};

export default function LoyaltyPage() {
  return <LoyaltyClient />;
}
import ServicesClient from "./ServicesClient";
export const metadata = {
  title: "Services - Cleaning Hub | Best & Excellence Cleaning Services",
  description: "Explore our comprehensive cleaning services including basic house cleaning, deep cleaning, green cleaning, sanitization, and more. Professional excellence for every space.",
  keywords: "cleaning services, house cleaning, office cleaning, deep cleaning, green cleaning, carpet cleaning, window cleaning",
  openGraph: {
    title: "Services - Cleaning Hub",
    description: "Professional cleaning services for homes, offices, and commercial spaces.",
    images: ["/og-services.jpg"],
    url: "https://cleaninghub.com/services",
  }
};

export default function ServicesPage() {
  return <ServicesClient />;
}
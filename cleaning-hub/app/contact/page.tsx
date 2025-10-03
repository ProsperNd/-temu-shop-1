import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us - Cleaning Hub | Best & Excellence Cleaning Services",
  description: "Get in touch with Cleaning Hub for professional cleaning services. Use our contact form, call us, email, or message via WhatsApp for quotes and inquiries.",
  keywords: "contact cleaning services, cleaning quote, customer support, house cleaning contact, office cleaning inquiry",
  openGraph: {
    title: "Contact Us - Cleaning Hub",
    description: "Reach out to us for all your cleaning needs. Professional support available.",
    images: ["/og-contact.jpg"],
    url: "https://cleaninghub.com/contact",
  }
};

export default function ContactPage() {
  return <ContactClient />;
}
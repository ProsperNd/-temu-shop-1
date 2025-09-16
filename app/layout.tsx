import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export const metadata: Metadata = {
  title: "Cleaning Hub - Best & Excellence Service",
  description: "Professional cleaning services for homes, offices, and commercial spaces. Best & Excellence Service.",
  keywords: "cleaning services, house cleaning, office cleaning, deep cleaning, green cleaning, sanitization",
  openGraph: {
    title: "Cleaning Hub - Best & Excellence Service",
    description: "Professional cleaning services for homes, offices, and commercial spaces.",
    images: ["/og-image.jpg"],
    url: "https://cleaninghub.com",
    siteName: "Cleaning Hub",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Hub - Best & Excellence Service",
    description: "Professional cleaning services for homes, offices, and commercial spaces.",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

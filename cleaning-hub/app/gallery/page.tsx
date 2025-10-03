import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Gallery - Cleaning Hub | Before & After Cleaning Photos",
  description: "View our gallery of before and after cleaning transformations. See the professional results of our house, office, and specialized cleaning services.",
  keywords: "cleaning gallery, before after cleaning, house cleaning photos, office cleaning results, deep cleaning transformation",
  openGraph: {
    title: "Gallery - Cleaning Hub",
    description: "Explore before and after photos of our cleaning services.",
    images: ["/og-gallery.jpg"],
    url: "https://cleaninghub.com/gallery",
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
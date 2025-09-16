export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  serviceId: string; // Links to service.id from services.ts
  beforeUrl: string;
  afterUrl: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Basic House Cleaning Transformation",
    description: "Before and after of a standard living room clean.",
    serviceId: "1",
    beforeUrl: "/images/gallery/before-basic-house.jpg",
    afterUrl: "/images/gallery/after-basic-house.jpg",
  },
  {
    id: "2",
    title: "Deep Cleaning Kitchen",
    description: "Thorough deep clean revealing spotless surfaces.",
    serviceId: "2",
    beforeUrl: "/images/gallery/before-deep-kitchen.jpg",
    afterUrl: "/images/gallery/after-deep-kitchen.jpg",
  },
  {
    id: "3",
    title: "Green Cleaning Bedroom",
    description: "Eco-friendly clean with natural products.",
    serviceId: "3",
    beforeUrl: "/images/gallery/before-green-bedroom.jpg",
    afterUrl: "/images/gallery/after-green-bedroom.jpg",
  },
  {
    id: "4",
    title: "Sanitization Office Space",
    description: "Disinfection for a healthier workspace.",
    serviceId: "4",
    beforeUrl: "/images/gallery/before-sanitization-office.jpg",
    afterUrl: "/images/gallery/after-sanitization-office.jpg",
  },
  {
    id: "5",
    title: "Carpet Cleaning Living Area",
    description: "Steam cleaned carpets looking brand new.",
    serviceId: "8",
    beforeUrl: "/images/gallery/before-carpet-living.jpg",
    afterUrl: "/images/gallery/after-carpet-living.jpg",
  },
  {
    id: "6",
    title: "Window Cleaning Exterior",
    description: "Crystal clear windows inside and out.",
    serviceId: "12",
    beforeUrl: "/images/gallery/before-window-exterior.jpg",
    afterUrl: "/images/gallery/after-window-exterior.jpg",
  },
  {
    id: "7",
    title: "Upholstery Cleaning Sofa",
    description: "Furniture restored to pristine condition.",
    serviceId: "9",
    beforeUrl: "/images/gallery/before-upholstery-sofa.jpg",
    afterUrl: "/images/gallery/after-upholstery-sofa.jpg",
  },
  {
    id: "8",
    title: "Move-Out Cleaning Apartment",
    description: "Complete end-of-lease clean for easy handover.",
    serviceId: "15",
    beforeUrl: "/images/gallery/before-moveout-apartment.jpg",
    afterUrl: "/images/gallery/after-moveout-apartment.jpg",
  },
];
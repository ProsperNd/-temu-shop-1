export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "Homeowner" or "Office Manager"
  rating: number; // 1-5
  review: string;
  service?: string; // Optional service name
  date: string; // ISO date
  avatar?: string; // Placeholder URL
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    review: "Cleaning Hub transformed my home! The deep cleaning service was thorough and the team was professional. My kitchen has never looked better. Highly recommend!",
    service: "Deep Cleaning",
    date: "2024-03-15",
    avatar: "/images/avatars/sarah.jpg",
  },
  {
    id: "2",
    name: "Mike Davis",
    role: "Office Manager",
    rating: 4.8,
    review: "Excellent office cleaning service. The team handled everything efficiently and our workspace is now spotless. Great attention to detail on sanitization.",
    service: "Office Cleaning",
    date: "2024-02-28",
    avatar: "/images/avatars/mike.jpg",
  },
  {
    id: "3",
    name: "Emily Chen",
    role: "Parent",
    rating: 5,
    review: "The green cleaning option is perfect for my family. No harsh chemicals, and the results are amazing. My kids can play safely now.",
    service: "Green Cleaning",
    date: "2024-03-10",
    avatar: "/images/avatars/emily.jpg",
  },
  {
    id: "4",
    name: "Robert Wilson",
    role: "Business Owner",
    rating: 4.9,
    review: "Post-construction cleaning was a lifesaver. The team removed all dust and debris quickly. Professional and reliable service.",
    service: "Post-Construction Cleaning",
    date: "2024-01-20",
    avatar: "/images/avatars/robert.jpg",
  },
  {
    id: "5",
    name: "Lisa Martinez",
    role: "Apartment Renter",
    rating: 4.7,
    review: "Move-out cleaning made returning my keys easy. Everything was left immaculate. Affordable and effective.",
    service: "Move-In/Move-Out Cleaning",
    date: "2024-04-05",
    avatar: "/images/avatars/lisa.jpg",
  },
  {
    id: "6",
    name: "David Lee",
    role: "School Administrator",
    rating: 5,
    review: "Sanitization services for our school were top-notch. The children are safe, and parents appreciate the cleanliness.",
    service: "Sanitization Services",
    date: "2024-02-15",
    avatar: "/images/avatars/david.jpg",
  },
  {
    id: "7",
    name: "Anna Taylor",
    role: "Medical Professional",
    rating: 4.9,
    review: "Medical facility cleaning exceeded expectations. Strict protocols followed, and the space is now sterile and welcoming.",
    service: "Medical Cleaning",
    date: "2024-03-22",
    avatar: "/images/avatars/anna.jpg",
  },
  {
    id: "8",
    name: "Tom Brown",
    role: "Homeowner",
    rating: 4.8,
    review: "Carpet cleaning brought my old rugs back to life. Stains gone, and they smell fresh. Will use again for upholstery.",
    service: "Carpet Cleaning",
    date: "2024-04-12",
    avatar: "/images/avatars/tom.jpg",
  },
];
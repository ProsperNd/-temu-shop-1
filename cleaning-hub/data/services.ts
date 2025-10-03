export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number; // Placeholder price in USD
  duration: number; // Duration in minutes
  image?: string;
  rating: number;
  totalReviews: number;
  pointsMultiplier: number; // For loyalty program
}

export const services: Service[] = [
  {
    id: "1",
    name: "Basic House Cleaning",
    description: "Regular cleaning of living areas, kitchen, and bathrooms",
    category: "Residential",
    price: 50,
    duration: 120,
    image: "/images/basic-cleaning.jpg",
    rating: 4.8,
    totalReviews: 124,
    pointsMultiplier: 1.0
  },
  {
    id: "2",
    name: "Deep Cleaning / Spring Cleaning",
    description: "Thorough deep cleaning for seasonal refresh",
    category: "Residential",
    price: 120,
    duration: 240,
    image: "/images/deep-cleaning.jpg",
    rating: 4.9,
    totalReviews: 89,
    pointsMultiplier: 1.2
  },
  {
    id: "3",
    name: "Green Cleaning Services",
    description: "Eco-friendly cleaning using natural products",
    category: "Residential",
    price: 60,
    duration: 150,
    image: "/images/green-cleaning.jpg",
    rating: 4.7,
    totalReviews: 67,
    pointsMultiplier: 1.1
  },
  {
    id: "4",
    name: "Sanitization Services",
    description: "Professional disinfection and sanitization",
    category: "Specialized",
    price: 80,
    duration: 180,
    image: "/images/sanitization.jpg",
    rating: 4.9,
    totalReviews: 45,
    pointsMultiplier: 1.3
  },
  {
    id: "5",
    name: "Ceiling and Wall Cleaning",
    description: "Wall washing and ceiling dust removal",
    category: "Residential",
    price: 70,
    duration: 160,
    image: "/images/wall-cleaning.jpg",
    rating: 4.6,
    totalReviews: 32,
    pointsMultiplier: 1.0
  },
  {
    id: "6",
    name: "Blind Cleaning",
    description: "Professional cleaning of window blinds",
    category: "Residential",
    price: 40,
    duration: 90,
    image: "/images/blind-cleaning.jpg",
    rating: 4.8,
    totalReviews: 28,
    pointsMultiplier: 1.0
  },
  {
    id: "7",
    name: "Curtain Cleaning",
    description: "Steam cleaning and spot treatment for curtains",
    category: "Residential",
    price: 55,
    duration: 120,
    image: "/images/curtain-cleaning.jpg",
    rating: 4.7,
    totalReviews: 19,
    pointsMultiplier: 1.0
  },
  {
    id: "8",
    name: "Carpet Cleaning",
    description: "Deep steam cleaning and stain removal for carpets",
    category: "Residential",
    price: 90,
    duration: 180,
    image: "/images/carpet-cleaning.jpg",
    rating: 4.9,
    totalReviews: 156,
    pointsMultiplier: 1.2
  },
  {
    id: "9",
    name: "Upholstery Cleaning",
    description: "Furniture and upholstery deep cleaning",
    category: "Residential",
    price: 75,
    duration: 150,
    image: "/images/upholstery-cleaning.jpg",
    rating: 4.8,
    totalReviews: 41,
    pointsMultiplier: 1.1
  },
  {
    id: "10",
    name: "Office Cleaning",
    description: "Professional commercial office cleaning services",
    category: "Commercial",
    price: 100,
    duration: 240,
    image: "/images/office-cleaning.jpg",
    rating: 4.7,
    totalReviews: 23,
    pointsMultiplier: 1.4
  },
  {
    id: "11",
    name: "Disaster Cleaning and Restoration",
    description: "Emergency cleaning after disasters or spills",
    category: "Specialized",
    price: 200,
    duration: 360,
    image: "/images/disaster-cleaning.jpg",
    rating: 4.9,
    totalReviews: 12,
    pointsMultiplier: 1.5
  },
  {
    id: "12",
    name: "Window Cleaning",
    description: "Interior and exterior window cleaning",
    category: "Residential",
    price: 65,
    duration: 140,
    image: "/images/window-cleaning.jpg",
    rating: 4.8,
    totalReviews: 78,
    pointsMultiplier: 1.0
  },
  {
    id: "13",
    name: "School Cleaning",
    description: "Educational facility cleaning and sanitization",
    category: "Commercial",
    price: 150,
    duration: 300,
    image: "/images/school-cleaning.jpg",
    rating: 4.6,
    totalReviews: 15,
    pointsMultiplier: 1.3
  },
  {
    id: "14",
    name: "Medical Cleaning",
    description: "Specialized medical facility cleaning",
    category: "Commercial",
    price: 180,
    duration: 360,
    image: "/images/medical-cleaning.jpg",
    rating: 4.9,
    totalReviews: 8,
    pointsMultiplier: 1.5
  },
  {
    id: "15",
    name: "Move-In/Move-Out Cleaning",
    description: "Complete cleaning for moving situations",
    category: "Residential",
    price: 110,
    duration: 240,
    image: "/images/move-cleaning.jpg",
    rating: 4.8,
    totalReviews: 34,
    pointsMultiplier: 1.2
  },
  {
    id: "16",
    name: "Post-Construction Cleaning",
    description: "Cleanup after construction or renovation",
    category: "Specialized",
    price: 130,
    duration: 300,
    image: "/images/construction-cleaning.jpg",
    rating: 4.7,
    totalReviews: 22,
    pointsMultiplier: 1.3
  }
];
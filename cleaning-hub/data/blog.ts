export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content
  excerpt: string;
  featuredImage?: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Cleaning Tips",
    slug: "cleaning-tips",
    description: "Practical advice for everyday cleaning and maintenance.",
  },
  {
    id: "2",
    name: "Home Care",
    slug: "home-care",
    description: "Tips for keeping your home clean and organized.",
  },
  {
    id: "3",
    name: "Green Cleaning",
    slug: "green-cleaning",
    description: "Eco-friendly cleaning methods and natural products.",
  },
  {
    id: "4",
    name: "Seasonal",
    slug: "seasonal",
    description: "Seasonal cleaning guides and preparations.",
  },
];

export const posts: Post[] = [
  {
    id: "1",
    title: "Top 10 Kitchen Cleaning Hacks You Need to Know",
    slug: "top-10-kitchen-cleaning-hacks",
    excerpt: "Discover simple and effective ways to keep your kitchen sparkling clean without spending hours scrubbing.",
    content: `# Top 10 Kitchen Cleaning Hacks You Need to Know

Your kitchen is the heart of the home, but it can quickly become a mess. Here are 10 quick hacks to keep it clean:

1. **Vinegar for Streak-Free Windows**: Mix equal parts vinegar and water in a spray bottle. Spray on windows and wipe with newspaper for a streak-free shine.

2. **Baking Soda for Grease**: Sprinkle baking soda on greasy surfaces, let it sit, then scrub with a damp sponge.

3. **Lemon for Cutting Boards**: Rub half a lemon over the board to remove stains and odors, then rinse.

And more tips...

Keep your kitchen clean with these easy methods!`,
    featuredImage: "/images/blog/kitchen-hacks.jpg",
    authorId: "1",
    categoryId: "1",
    tags: ["kitchen", "hacks", "tips"],
    status: "published",
    views: 1500,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "How to Organize Your Closet Like a Pro",
    slug: "organize-closet-pro",
    excerpt: "Transform your cluttered closet into an organized space with these step-by-step tips.",
    content: `# How to Organize Your Closet Like a Pro

Cluttered closets can be stressful. Follow these steps:

1. **Declutter**: Sort items into keep, donate, and trash.

2. **Categorize**: Group clothes by type and season.

3. **Use Storage Solutions**: Invest in shelves, hangers, and bins.

Enjoy your newly organized closet!`,
    featuredImage: "/images/blog/closet-organization.jpg",
    authorId: "1",
    categoryId: "2",
    tags: ["organization", "closet", "home"],
    status: "published",
    views: 1200,
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
  },
  {
    id: "3",
    title: "Benefits of Green Cleaning Products",
    slug: "benefits-green-cleaning-products",
    excerpt: "Learn why switching to eco-friendly cleaners is better for your health and the planet.",
    content: `# Benefits of Green Cleaning Products

Green cleaning is more than a trend:

- **Safer for Health**: Fewer harsh chemicals.

- **Environmentally Friendly**: Biodegradable and non-toxic.

- **Cost-Effective**: Many DIY options.

Make the switch today for a cleaner world!`,
    featuredImage: "/images/blog/green-products.jpg",
    authorId: "2",
    categoryId: "3",
    tags: ["green", "eco", "products"],
    status: "published",
    views: 2000,
    createdAt: "2024-03-05",
    updatedAt: "2024-03-05",
  },
  {
    id: "4",
    title: "Spring Cleaning Checklist for Your Home",
    slug: "spring-cleaning-checklist",
    excerpt: "Get your home ready for spring with this comprehensive cleaning checklist.",
    content: `# Spring Cleaning Checklist for Your Home

Don't miss a spot this spring:

1. **Deep Clean Floors**: Vacuum and mop thoroughly.

2. **Wash Windows**: Inside and out.

3. **Organize Storage**: Declutter closets and garages.

4. **Clean Appliances**: Oven, fridge, and more.

A fresh start awaits!`,
    featuredImage: "/images/blog/spring-cleaning.jpg",
    authorId: "2",
    categoryId: "4",
    tags: ["spring", "checklist", "seasonal"],
    status: "published",
    views: 1800,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
  {
    id: "5",
    title: "Natural Ways to Remove Stains from Carpets",
    slug: "natural-ways-remove-stains-carpets",
    excerpt: "Say goodbye to carpet stains using household items you already have.",
    content: `# Natural Ways to Remove Stains from Carpets

Stains happen, but natural remedies work wonders:

1. **Baking Soda and Vinegar**: For fresh stains.

2. **Club Soda**: For wine spills.

3. **Hydrogen Peroxide**: For older stains.

Restore your carpets naturally!`,
    featuredImage: "/images/blog/carpet-stains.jpg",
    authorId: "1",
    categoryId: "1",
    tags: ["carpet", "stains", "natural"],
    status: "published",
    views: 900,
    createdAt: "2024-04-20",
    updatedAt: "2024-04-20",
  },
];
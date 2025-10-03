import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog - Cleaning Hub | Cleaning Tips & Articles",
  description: "Read our blog for expert cleaning tips, home care advice, green cleaning methods, and seasonal guides to keep your space spotless.",
  keywords: "cleaning blog, house cleaning tips, green cleaning, home organization, seasonal cleaning, cleaning hacks",
  openGraph: {
    title: "Blog - Cleaning Hub",
    description: "Discover useful articles on cleaning and home maintenance.",
    images: ["/og-blog.jpg"],
    url: "https://cleaninghub.com/blog",
  }
};

export default function BlogPage() {
  return <BlogClient />;
}
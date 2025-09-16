import { notFound } from "next/navigation";
import PostClient from "./PostClient";
import { posts } from "@/data/blog";

export async function generateStaticParams() {
  return posts
    .filter((post) => post.status === "published")
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Post Not Found - Cleaning Hub",
    };
  }

  return {
    title: `${post.title} - Cleaning Hub Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || "/og-blog.jpg"],
      url: `https://cleaninghub.com/blog/${post.slug}`,
    },
  };
}

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return <PostClient post={post} />;
}
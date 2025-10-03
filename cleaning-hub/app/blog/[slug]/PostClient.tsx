"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Eye, Tag, MessageCircle, Send, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { posts, categories } from "@/data/blog";

interface PostClientProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    authorId: string;
    categoryId: string;
    tags: string[];
    status: "draft" | "published";
    views: number;
    createdAt: string;
    updatedAt: string;
  };
}

export default function PostClient({ post }: PostClientProps) {
  const [commentForm, setCommentForm] = useState({ name: "", comment: "" });
  const [comments, setComments] = useState([
    {
      id: "1",
      name: "John Doe",
      comment: "Great article! These tips really helped me clean my kitchen.",
      createdAt: "2024-01-16",
    },
    {
      id: "2",
      name: "Jane Smith",
      comment: "Thanks for the hacks. Will try the vinegar method.",
      createdAt: "2024-01-17",
    },
    {
      id: "3",
      name: "Mike Johnson",
      comment: "Very informative. Looking forward to more posts.",
      createdAt: "2024-01-18",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const category = categories.find((cat) => cat.id === post.categoryId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Placeholder: In production, post to API
    console.log("New comment:", commentForm);
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        name: commentForm.name,
        comment: commentForm.comment,
        createdAt: new Date().toLocaleDateString(),
      },
    ]);
    setCommentForm({ name: "", comment: "" });
    setIsSubmitting(false);
  };

  const relatedPosts = posts
    .filter((p) => p.status === "published" && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <article className="max-w-4xl mx-auto px-4">
        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden mb-8"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Post Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="text-blue-600" size={16} />
            <span className="text-sm font-semibold text-gray-600">
              {category?.name || "Uncategorized"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={14} />
                <span>{post.views} views</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 mb-8">{post.excerpt}</p>
        </motion.div>

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden group"
                >
                  {relatedPost.featuredImage && (
                    <div className="relative h-32 bg-gray-200">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <span className="text-blue-600 font-semibold text-sm">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MessageCircle className="mr-2" size={24} />
            Comments ({comments.length})
          </h2>

          {/* Comments List */}
          <div className="space-y-4 mb-8">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-800">{comment.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Comment
              </label>
              <textarea
                rows={4}
                value={commentForm.comment}
                onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
              <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
            </button>
          </form>
        </motion.section>
      </article>
    </div>
  );
}
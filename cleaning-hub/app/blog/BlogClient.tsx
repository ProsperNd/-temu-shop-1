"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Eye, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { posts, categories } from "@/data/blog";

export default function BlogClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => post.status === "published");

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => {
        const category = categories.find(cat => cat.id === post.categoryId);
        return category?.name === selectedCategory;
      });
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const availableCategories = ["All", ...new Set(posts
    .filter(p => p.status === "published")
    .map(post => {
      const category = categories.find(cat => cat.id === post.categoryId);
      return category?.name || "Uncategorized";
    })
  )];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Cleaning Blog & Tips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover expert advice, cleaning hacks, and home care tips to keep your space spotless and organized.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12 bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="text-gray-500" size={16} />
                  <span>{posts.filter(p => p.status === "published").length} Posts</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Eye className="text-gray-500" size={16} />
                  <span>{posts.filter(p => p.status === "published").reduce((sum, p) => sum + p.views, 0)} Total Views</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => {
                const category = categories.find(cat => cat.id === post.categoryId);
                return (
                  <motion.div
                    key={post.id}
                    variants={cardVariants}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
                  >
                    {post.featuredImage && (
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="text-blue-600" size={16} />
                        <span className="text-sm font-semibold text-gray-600">
                          {category?.name || "Uncategorized"}
                        </span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="block">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye size={14} />
                          <span>{post.views} views</span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No Posts Found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Link
                href="/blog"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Posts
              </Link>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center bg-blue-600 text-white p-12 rounded-lg"
        >
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Our Latest Tips
          </h2>
          <p className="text-xl mb-8">
            Subscribe to our newsletter for more cleaning advice and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-yellow-500 text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Subscribe Now
            </Link>
            <Link
              href="/services"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Book a Service
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
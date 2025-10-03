"use client";

import { motion } from "framer-motion";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { Phone, MessageCircle } from "lucide-react";
import { contactInfo } from "@/constants/contact";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCard";
import TestimonialCard from "@/components/ui/TestimonialCard";

export default function Home() {
  const featuredServices = services.slice(0, 6); // Show top 6 services

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            className="text-center"
          >
            <motion.h1
              variants={heroVariants}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Cleaning Hub
            </motion.h1>
            <motion.p
              variants={heroVariants}
              className="text-xl md:text-2xl mb-8 text-blue-100"
            >
              Best & Excellence Service
            </motion.p>
            <motion.p
              variants={heroVariants}
              className="text-lg md:text-xl mb-12 max-w-3xl mx-auto"
            >
              Professional cleaning services for homes, offices, and commercial spaces. 
              We bring the sparkle back to your world with our expert team and eco-friendly solutions.
            </motion.p>
            <motion.div
              variants={heroVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/booking"
                className="bg-yellow-500 text-blue-900 font-semibold py-4 px-8 rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-2"
              >
                <span>Book Now</span>
              </Link>
              <a
                href={`https://wa.me/234${contactInfo.whatsapp}`}
                className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2"
              >
                <MessageCircle size={20} />
                <span>Contact Us</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            Our Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                custom={index}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 text-gray-800"
          >
            What Our Customers Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6"
          >
            Ready to Experience Clean Perfection?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Book your cleaning service today and discover why we're the best in the business!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/booking"
              className="bg-yellow-500 text-blue-900 font-semibold py-4 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Book Cleaning Service
            </Link>
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center justify-center space-x-2 bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Phone size={20} />
              <span>Call Now</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

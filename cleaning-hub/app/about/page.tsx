"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { Users, Target, Award, Phone } from "lucide-react";
import { contactInfo } from "@/constants/contact";
import Link from "next/link";
import TestimonialCard from "@/components/ui/TestimonialCard";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="text-center mb-20"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            About Cleaning Hub
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Your trusted partner for professional cleaning services with excellence and care. 
            Since our founding, we've been dedicated to providing the best cleaning solutions for homes and businesses.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center space-x-8 text-gray-600"
          >
            <div className="flex items-center space-x-2">
              <Award size={24} className="text-blue-600" />
              <span>Best & Excellence Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={24} className="text-blue-600" />
              <span>Expert Team</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={24} className="text-blue-600" />
              <span>Customer Satisfaction</span>
            </div>
          </motion.div>
        </motion.section>

        {/* Our Story */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Cleaning Hub was founded with a simple mission: to provide the highest quality cleaning services 
                with unmatched excellence and customer care. From humble beginnings, we've grown into a trusted 
                name in professional cleaning, serving hundreds of satisfied customers across residential and 
                commercial spaces.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team of dedicated professionals is trained in the latest cleaning techniques and uses 
                eco-friendly products to ensure your space is not only clean but also safe and healthy.
              </p>
              <p className="text-lg text-gray-600">
                We're more than just a cleaning company; we're your partner in maintaining a spotless environment.
              </p>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white h-80 flex items-center justify-center">
                <div className="text-center">
                  <Users size={64} className="mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-2">Our Team</h3>
                  <p className="opacity-90">Experienced professionals dedicated to excellence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Our Values */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="mb-20 bg-white rounded-lg p-8 shadow-sm"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target size={48} className="text-blue-600" />,
                title: "Excellence",
                description: "We strive for perfection in every cleaning service we provide, ensuring outstanding results every time."
              },
              {
                icon: <Users size={48} className="text-blue-600" />,
                title: "Integrity",
                description: "Honesty and transparency in all our dealings, building trust with every customer interaction."
              },
              {
                icon: <Award size={48} className="text-blue-600" />,
                title: "Care",
                description: "Treating your space and belongings with the utmost care and respect, like our own."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Cleaning Hub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                number: "1",
                title: "Experienced Team",
                description: "Our certified professionals have years of experience in all types of cleaning services."
              },
              {
                number: "2",
                title: "Eco-Friendly Products",
                description: "We use safe, green cleaning products that are gentle on your family and the environment."
              },
              {
                number: "3",
                title: "Satisfaction Guaranteed",
                description: "100% satisfaction guarantee - if you're not happy, we'll make it right."
              },
              {
                number: "4",
                title: "Flexible Scheduling",
                description: "Book at your convenience with our easy online booking system and flexible hours."
              }
            ].map((reason, index) => (
              <motion.div
                key={reason.title}
                variants={itemVariants}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {reason.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

{/* Testimonials Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Customer Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={itemVariants}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-blue-600 text-white p-12 rounded-lg text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Join Our Satisfied Customers
          </h2>
          <p className="text-xl mb-8">
            Experience the Cleaning Hub difference. Book your service today and discover why we're the best choice for professional cleaning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-yellow-500 text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Book Service Now
            </Link>
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center justify-center space-x-2 bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Phone size={20} />
              <span>Call {contactInfo.phone}</span>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
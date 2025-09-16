"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactInfo } from "@/constants/contact";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number too short"),
  message: z.string().min(1, "Message is required").max(500, "Message too long"),
});

type FormData = z.infer<typeof schema>;

export default function ContactClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      // Placeholder: In production, send to API or n8n workflow
      console.log("Form submitted:", data);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with Cleaning Hub. Whether you have questions, need a quote, or want to book a service, we're here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Info */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get In Touch</h2>
            
            {/* Phone */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-blue-50 rounded-lg">
              <Phone className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Phone</p>
                <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-green-50 rounded-lg">
              <MessageCircle className="text-green-600" size={24} />
              <div>
                <p className="font-semibold">WhatsApp</p>
                <a 
                  href={contactInfo.social.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  Message us on WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-purple-50 rounded-lg">
              <Mail className="text-purple-600" size={24} />
              <div>
                <p className="font-semibold">Email</p>
                <a href={`mailto:${contactInfo.email}`} className="text-purple-600 hover:underline">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-gray-600" size={24} />
              <div>
                <p className="font-semibold">Address</p>
                <p>{contactInfo.address}</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2" size={20} />
                Business Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(contactInfo.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-sm">
                    <span className="capitalize">{day}</span>
                    <span>{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  {...register("message")}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </button>
            </form>

            {submitStatus === "success" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
              >
                Message sent successfully! We'll get back to you soon.
              </motion.p>
            )}

            {submitStatus === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              >
                There was an error sending your message. Please try again.
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center bg-green-600 text-white p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Quick Chat on WhatsApp</h2>
          <p className="text-lg mb-6">For immediate assistance, message us directly!</p>
          <a
            href={`${contactInfo.social.whatsapp}?text=Hi%20Cleaning%20Hub,%20I'd%20like%20to%20inquire%20about%20your%20services.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-white text-green-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={24} />
            <span>Start WhatsApp Chat</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
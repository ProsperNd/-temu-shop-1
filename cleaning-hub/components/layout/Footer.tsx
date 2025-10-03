"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle } from "lucide-react";
import { navigation } from "@/constants/navigation";
import { contactInfo } from "@/constants/contact";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 block">
              Cleaning Hub
            </Link>
            <p className="text-gray-300 mb-4">
              Providing professional and reliable cleaning services with excellence and care. 
              Your trusted partner for clean and healthy spaces.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href={contactInfo.social.facebook} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href={contactInfo.social.instagram} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href={contactInfo.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={24} />
              </a>
              <a href={contactInfo.social.whatsapp} className="text-gray-400 hover:text-blue-400 transition-colors">
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.slice(0, -1).map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-400" />
                <span className="text-gray-300">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-400" />
                <span className="text-gray-300">{contactInfo.email}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-400 mt-0.5" />
                <span className="text-gray-300">{contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Business Hours</h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 text-sm">
            {Object.entries(contactInfo.businessHours).map(([day, hours]) => (
              <div key={day} className="text-gray-300">
                <div className="font-medium capitalize">{day}</div>
                <div>{hours}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Cleaning Hub. All rights reserved. | Designed with ❤️ for excellent service</p>
        </div>
      </div>
    </footer>
  );
}
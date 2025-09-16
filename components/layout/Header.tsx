"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { navigation } from "@/constants/navigation";
import { contactInfo } from "@/constants/contact";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="hidden md:flex items-center justify-between px-4 py-2 bg-blue-600 text-white">
        <div className="flex items-center space-x-4">
          <a href={`tel:${contactInfo.phone}`} className="flex items-center space-x-1 hover:text-yellow-300">
            <Phone size={16} />
            <span>{contactInfo.phone}</span>
          </a>
          <a href={`https://wa.me/234${contactInfo.whatsapp}`} className="flex items-center space-x-1 hover:text-yellow-300">
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>
        </div>
        <div className="text-sm">
          Free Quote: Call {contactInfo.phone}
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Cleaning Hub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${item.className || ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-700 hover:text-blue-600"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors ${item.className || ""}`}
                onClick={toggleMobileMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
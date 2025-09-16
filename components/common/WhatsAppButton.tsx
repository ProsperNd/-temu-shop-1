"use client";

import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { contactInfo } from "@/constants/contact";

const quickMessages = [
  {
    id: "quote",
    title: "Get a Quote",
    message: "Hi! I'd like to get a quote for cleaning services. Can you help me with pricing?"
  },
  {
    id: "booking",
    title: "Book Service",
    message: "Hello! I'd like to book a cleaning service. When are you available?"
  },
  {
    id: "emergency",
    title: "Emergency Clean",
    message: "Hi! I need emergency cleaning services as soon as possible. Are you available today?"
  },
  {
    id: "question",
    title: "Ask Question",
    message: "Hello! I have some questions about your cleaning services. Can you help?"
  }
];

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = (message: string) => {
    const whatsappUrl = `https://wa.me/234${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 bg-white rounded-lg shadow-lg border p-4 w-80"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Quick Messages</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {quickMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => sendMessage(msg.message)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-green-50 border hover:border-green-200 transition-colors"
                  >
                    <div className="font-medium text-gray-800 mb-1">{msg.title}</div>
                    <div className="text-sm text-gray-600 line-clamp-2">{msg.message}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t">
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center justify-center space-x-2 w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone size={18} />
                  <span>Call {contactInfo.phone}</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
            isOpen ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <X className="text-white" size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="whatsapp"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <MessageCircle className="text-white" size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"
          />
        )}
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
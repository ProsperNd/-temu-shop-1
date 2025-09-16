"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Image as LucideImage, Filter, Eye } from "lucide-react";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";
import { services } from "@/data/services";

interface GalleryItemWithService {
  id: string;
  title: string;
  description: string;
  serviceId: string;
  beforeUrl: string;
  afterUrl: string;
  serviceName: string;
}

export default function GalleryClient() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItemWithService | null>(null);
  const [filteredItems, setFilteredItems] = useState<GalleryItemWithService[]>([]);

  const allServices = ["All", ...new Set(galleryItems.map(item => {
    const service = services.find(s => s.id === item.serviceId);
    return service?.name || "Uncategorized";
  }))];

  const itemsWithService: GalleryItemWithService[] = galleryItems.map(item => ({
    ...item,
    serviceName: services.find(s => s.id === item.serviceId)?.name || "General Cleaning",
  }));

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === "All") {
      setFilteredItems(itemsWithService);
    } else {
      setFilteredItems(itemsWithService.filter(item => item.serviceName === filter));
    }
  };

  const openModal = (item: GalleryItemWithService) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  if (selectedFilter === "All") {
    setFilteredItems(itemsWithService);
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.5 },
    }),
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
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
            Before & After Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Witness the remarkable transformations from our professional cleaning services. See how we turn spaces from cluttered to clean.
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12 bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {allServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredItems.length} transformations
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-12"
        >
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
                  onClick={() => openModal(item)}
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <LucideImage size={16} className="text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">{item.serviceName}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-0">
                    <div className="relative h-48 bg-gray-200 group-hover:brightness-75 transition-all">
                      <Image
                        src={item.beforeUrl}
                        alt={`${item.title} - Before`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">Before</span>
                      </div>
                    </div>
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={item.afterUrl}
                        alt={`${item.title} - After`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">After</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-2 flex items-center justify-center">
                    <Eye size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">View Details</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                No Transformations Found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filter criteria.
              </p>
            </div>
          )}
        </motion.div>

        {/* Modal */}
        {selectedItem && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h2>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-6">{selectedItem.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <Image
                      src={selectedItem.beforeUrl}
                      alt={`${selectedItem.title} - Before`}
                      width={600}
                      height={400}
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Before
                    </div>
                  </div>
                  <div className="relative">
                    <Image
                      src={selectedItem.afterUrl}
                      alt={`${selectedItem.title} - After`}
                      width={600}
                      height={400}
                      className="rounded-lg object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm">
                      After
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Service: {selectedItem.serviceName}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
import { Star } from "lucide-react";
import Link from "next/link";
import { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">C</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {service.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(service.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">({service.totalReviews})</span>
          </div>
          <span className="text-2xl font-bold text-blue-600">${service.price}</span>
        </div>
        <Link
          href={`/services/${service.id}`}
          className="w-full block text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book Service
        </Link>
      </div>
    </div>
  );
}
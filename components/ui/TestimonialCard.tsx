import { Star } from "lucide-react";
import { Testimonial } from "@/data/testimonials";
import Image from "next/image";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start space-x-4 mb-4">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">{testimonial.name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(testimonial.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-yellow-500 ml-1">{testimonial.rating}</span>
          </div>
          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic mb-4">"{testimonial.review}"</p>
      {testimonial.service && (
        <p className="text-sm text-blue-600 font-medium mb-2">Service: {testimonial.service}</p>
      )}
      <p className="text-xs text-gray-500">{new Date(testimonial.date).toLocaleDateString()}</p>
    </div>
  );
}
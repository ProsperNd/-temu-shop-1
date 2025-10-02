import { notFound } from 'next/navigation';
import { services } from '@/data/services';
import { galleryItems } from '@/data/gallery';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Star, Users, Award } from 'lucide-react';

interface ServicePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = services.find(s => s.id === id);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.name} - Professional Cleaning Service`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = services.find(s => s.id === id);

  if (!service) {
    notFound();
  }

  // Get related gallery items for this service
  const relatedGalleryItems = galleryItems.filter(item => item.serviceId === service.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Services
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {service.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    ${service.price}
                  </div>
                  <div className="text-sm text-gray-500">Starting Price</div>
                </div>
              </div>

              {/* Service Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <div className="font-semibold">{service.duration} min</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <div>
                    <div className="font-semibold">{service.rating}</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="text-blue-600" size={20} />
                  <div>
                    <div className="font-semibold">{service.totalReviews}</div>
                    <div className="text-sm text-gray-500">Reviews</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="text-green-600" size={20} />
                  <div>
                    <div className="font-semibold">{service.pointsMultiplier}x</div>
                    <div className="text-sm text-gray-500">Loyalty Points</div>
                  </div>
                </div>
              </div>

              {/* Service Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Service Includes:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Professional cleaning staff</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Quality cleaning supplies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>100% satisfaction guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Flexible scheduling</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {relatedGalleryItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Before & After Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedGalleryItems.map((item) => (
                    <div key={item.id} className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">Before</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="w-full h-32 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-semibold">After</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Ready to Book?
              </h3>
              <p className="text-gray-600 mb-6">
                Schedule your {service.name.toLowerCase()} service today and experience professional cleaning excellence.
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Service Fee:</span>
                  <span className="font-bold text-lg">${service.price}</span>
                </div>

                <Link
                  href={`/booking?service=${service.id}`}
                  className="w-full block text-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </Link>

                <Link
                  href="/contact"
                  className="w-full block text-center border border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Get Custom Quote
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>Call us: (555) 123-CLEAN</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✉️</span>
                    <span>info@cleaningservice.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                You Might Also Like
              </h3>
              <div className="space-y-3">
                {services
                  .filter(s => s.category === service.category && s.id !== service.id)
                  .slice(0, 3)
                  .map((relatedService) => (
                    <Link
                      key={relatedService.id}
                      href={`/services/${relatedService.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-800">
                        {relatedService.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${relatedService.price}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
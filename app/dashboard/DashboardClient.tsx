"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  Star, 
  Gift, 
  Settings, 
  CreditCard, 
  Phone,
  Mail,
  MapPin,
  Award,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

// Mock data - in real app this would come from database
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  loyaltyTier: "Silver",
  loyaltyPoints: 1250,
  totalBookings: 8,
  memberSince: "2024-01-15"
};

const mockBookings = [
  {
    id: "1",
    service: "Deep Cleaning",
    date: "2024-11-15",
    time: "10:00 AM",
    status: "confirmed",
    price: 120
  },
  {
    id: "2",
    service: "Basic House Cleaning",
    date: "2024-11-08",
    time: "2:00 PM",
    status: "completed",
    price: 80
  },
  {
    id: "3",
    service: "Carpet Cleaning",
    date: "2024-10-25",
    time: "11:00 AM",
    status: "completed",
    price: 90
  }
];

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "loyalty", label: "Loyalty Rewards", icon: Gift },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze": return "text-orange-600 bg-orange-100";
      case "Silver": return "text-gray-600 bg-gray-100";
      case "Gold": return "text-yellow-600 bg-yellow-100";
      case "Platinum": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-blue-600 bg-blue-100";
      case "completed": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {mockUser.name}!
          </h1>
          <p className="text-gray-600">
            Manage your bookings, track your loyalty points, and update your profile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{mockUser.name}</h3>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTierColor(mockUser.loyaltyTier)}`}>
                    <Award size={12} className="mr-1" />
                    {mockUser.loyaltyTier} Member
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-800">{mockUser.totalBookings}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Gift className="text-yellow-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Loyalty Points</p>
                        <p className="text-2xl font-bold text-gray-800">{mockUser.loyaltyPoints}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Star className="text-green-600" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="text-lg font-bold text-gray-800">
                          {new Date(mockUser.memberSince).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Recent Bookings</h3>
                    <Link 
                      href="/booking" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book New Service
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    {mockBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{booking.service}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-gray-800">${booking.price}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">All Bookings</h3>
                  <Link 
                    href="/booking" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Booking
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-800">{booking.service}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="text-gray-400" size={16} />
                          <span className="text-gray-600">{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="text-gray-400" size={16} />
                          <span className="text-gray-600">{booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="text-gray-400" size={16} />
                          <span className="text-gray-600 font-semibold">${booking.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loyalty Tab */}
            {activeTab === "loyalty" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Loyalty Program</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="text-blue-600" size={24} />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">{mockUser.loyaltyPoints}</h4>
                      <p className="text-gray-600">Available Points</p>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="text-yellow-600" size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{mockUser.loyaltyTier}</h4>
                      <p className="text-gray-600">Current Tier</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="font-semibold text-gray-800 mb-4">Next Tier Progress</h4>
                    <div className="bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">250 more points to reach Gold tier</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Information</h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline mr-2" size={16} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={mockUser.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline mr-2" size={16} />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={mockUser.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline mr-2" size={16} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={mockUser.phone}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline mr-2" size={16} />
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Add your address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-gray-700">Email notifications for booking confirmations</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-gray-700">SMS reminders for upcoming appointments</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-gray-700">Marketing emails and promotions</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-4">Security</h4>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Change Password
                    </button>
                  </div>
                  
                  <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
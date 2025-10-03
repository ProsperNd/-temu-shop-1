
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Star, Award, } from "lucide-react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  loyaltyPoints: number;
  reviewsCount: number;
}

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
  notes?: string;
}

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    upcomingBookings: 0,
    loyaltyPoints: 0,
    reviewsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      fetchDashboardData();
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch bookings
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", session?.user.id)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookings: Booking[] = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));

      const totalBookings = bookings.length;
      const upcomingBookings = bookings.filter(booking =>
        booking.status === "confirmed" &&
        new Date(booking.date) > new Date()
      ).length;

      // Fetch loyalty points (mock for now)
      const loyaltyPoints = 150; // This would come from a real API

      // Fetch reviews count
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("userId", "==", session?.user.id)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsCount = reviewsSnapshot.size;

      setStats({
        totalBookings,
        upcomingBookings,
        loyaltyPoints,
        reviewsCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      href: "/bookings",
      color: "bg-blue-500",
    },
    {
      title: "Upcoming Services",
      value: stats.upcomingBookings,
      icon: Calendar,
      href: "/bookings",
      color: "bg-green-500",
    },
    {
      title: "Loyalty Points",
      value: stats.loyaltyPoints,
      icon: Award,
      href: "/loyalty",
      color: "bg-yellow-500",
    },
    {
      title: "Reviews Written",
      value: stats.reviewsCount,
      icon: Star,
      href: "/reviews",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name || "Customer"}!
        </h1>
        <p className="text-gray-600">Here's an overview of your account</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((card, index) => (
          <Link key={card.title} href={card.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/booking"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              Book New Service
            </Link>
            <Link
              href="/loyalty"
              className="block w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-center"
            >
              View Loyalty Rewards
            </Link>
            <Link
              href="/referrals"
              className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
            >
              Refer a Friend
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Upcoming booking reminder</p>
                <p className="text-xs text-gray-500">You have {stats.upcomingBookings} upcoming services</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Loyalty points earned</p>
                <p className="text-xs text-gray-500">You've earned {stats.loyaltyPoints} points so far</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Reviews submitted</p>
                <p className="text-xs text-gray-500">You've written {stats.reviewsCount} reviews</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
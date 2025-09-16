"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Star, Award, Clock, DollarSign, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
}

export default function DashboardClient() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      fetchUserData();
      fetchBookings();
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", session?.user.id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUserData(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", session?.user.id),
        orderBy("date", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const fetchedBookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback to mock data
      setBookings([
        {
          id: "1",
          serviceName: "Basic House Cleaning",
          date: "2024-09-20",
          time: "10:00 AM",
          status: "confirmed" as const,
          price: 150,
        },
        {
          id: "2",
          serviceName: "Deep Cleaning",
          date: "2024-09-15",
          time: "2:00 PM",
          status: "completed" as const,
          price: 250,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Please log in.</div>;
  }

  const totalPoints = userData?.loyaltyPoints || 0;
  const tier = userData?.loyaltyTier || "bronze";
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date()).length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData?.name || session.user.name}!</h1>
            <p className="text-gray-600">Here's what's happening with your account.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Recent"}</p>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPoints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tier</p>
              <p className="text-2xl font-semibold text-gray-900 capitalize">{tier}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Recent Bookings */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          <Link href="/(customer)/bookings" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
            View All
          </Link>
        </div>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{booking.serviceName}</p>
                    <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                    booking.status === "completed" ? "bg-blue-100 text-blue-800" :
                    booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {booking.status}
                  </span>
                  <p className="text-sm font-medium text-gray-900">${booking.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No bookings yet. <Link href="/booking" className="text-blue-600 hover:underline">Book your first service</Link>
          </div>
        )}
      </motion.section>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link href="/(customer)/bookings" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
              <p className="text-sm text-gray-600">View, reschedule, or cancel bookings</p>
            </div>
          </div>
        </Link>

        <Link href="/(customer)/loyalty" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Loyalty Rewards</h3>
              <p className="text-sm text-gray-600">Check points and redeem rewards</p>
            </div>
          </div>
        </Link>

        <Link href="/(customer)/profile" className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profile Settings</h3>
              <p className="text-sm text-gray-600">Update your account information</p>
            </div>
          </div>
        </Link>
      </motion.section>
    </div>
  );
}
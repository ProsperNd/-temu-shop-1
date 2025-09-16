"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, Trash2, Edit, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
  notes?: string;
}

export default function BookingsClient() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      fetchBookings();
    }
  }, [status, session]);

  const fetchBookings = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", session?.user.id),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedBookings: Booking[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBookings.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(fetchedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Showing sample data.");
      // Fallback mock data
      setBookings([
        {
          id: "1",
          serviceName: "Basic House Cleaning",
          date: "2024-09-20",
          time: "10:00 AM",
          status: "confirmed",
          price: 150,
          notes: "Standard clean",
        },
        {
          id: "2",
          serviceName: "Deep Cleaning",
          date: "2024-09-15",
          time: "2:00 PM",
          status: "completed",
          price: 250,
          notes: "Kitchen focus",
        },
        {
          id: "3",
          serviceName: "Office Cleaning",
          date: "2024-09-10",
          time: "9:00 AM",
          status: "cancelled",
          price: 200,
        },
        {
          id: "4",
          serviceName: "Window Cleaning",
          date: "2024-09-05",
          time: "11:00 AM",
          status: "pending",
          price: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      await updateDoc(doc(db, "bookings", id), {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
      setError("");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking. Please contact support.");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { class: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      confirmed: { class: "bg-green-100 text-green-800", icon: CheckCircle },
      completed: { class: "bg-blue-100 text-blue-800", icon: CheckCircle },
      cancelled: { class: "bg-red-100 text-red-800", icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <span className="ml-2">Loading your bookings...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your bookings.</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your cleaning appointments and service history</p>
        </div>
        <Link
          href="/booking"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Calendar size={20} />
          <span>Book New Service</span>
        </Link>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md"
        >
          {error}
        </motion.div>
      )}

      {bookings.length === 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Get started by booking your first cleaning service.</p>
          <Link
            href="/booking"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Book Now
          </Link>
        </motion.section>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{booking.serviceName}</div>
                          {booking.notes && <div className="text-sm text-gray-500">{booking.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock size={16} />
                        <span>{booking.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        <span>${booking.price}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === "pending" || booking.status === "confirmed" ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {/* Reschedule modal/logic */ console.log("Reschedule", booking.id)}}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Edit size={16} />
                            <span>Reschedule</span>
                          </button>
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            disabled={deletingId === booking.id}
                            className="text-red-600 hover:text-red-900 flex items-center space-x-1 disabled:opacity-50"
                          >
                            {deletingId === booking.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                <span>Cancelling...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 size={16} />
                                <span>Cancel</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : booking.status === "completed" ? (
                        <span className="text-green-600">Service Completed</span>
                      ) : (
                        <span className="text-red-600">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length > 5 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link href="#" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                Load More
              </Link>
            </div>
          )}
        </motion.section>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center pt-6"
      >
        <Link
          href="/dashboard"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}

function getStatusBadge(status: string) {
  const badges = {
    pending: { class: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
    confirmed: { class: "bg-green-100 text-green-800", icon: CheckCircle },
    completed: { class: "bg-blue-100 text-blue-800", icon: CheckCircle },
    cancelled: { class: "bg-red-100 text-red-800", icon: XCircle },
  };
  const badge = badges[status as keyof typeof badges];
  const Icon = badge.icon;
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
      <Icon size={12} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
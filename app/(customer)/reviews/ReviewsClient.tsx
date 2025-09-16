"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, User, Calendar, Send, Edit3, Trash2, AlertCircle, Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(1000, "Comment too long"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  bookingId: string;
  serviceName: string;
  date: string;
  createdAt: string;
  photos?: string[];
}

interface BookingForReview {
  id: string;
  serviceName: string;
  date: string;
}

export default function ReviewsClient() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookingsForReview, setBookingsForReview] = useState<BookingForReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingForReview | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
  });

  const rating = watch("rating");

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      fetchReviews();
      fetchBookingsForReview();
    }
  }, [status, session]);

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("userId", "==", session!.user.id),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const fetchedReviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setMessage("Failed to load reviews. Using sample data.");
      // Mock data
      setReviews([
        {
          id: "1",
          rating: 5,
          title: "Excellent Service!",
          comment: "The team was professional and thorough. My home has never been cleaner. Highly recommend!",
          bookingId: "1",
          serviceName: "Deep Cleaning",
          date: "2024-09-15",
          createdAt: "2024-09-16T10:00:00Z",
          photos: [],
        },
        {
          id: "2",
          rating: 4,
          title: "Great Experience",
          comment: "Good cleaning service, but could be a bit faster next time. Overall satisfied.",
          bookingId: "2",
          serviceName: "Basic House Cleaning",
          date: "2024-09-10",
          createdAt: "2024-09-11T14:30:00Z",
          photos: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsForReview = async () => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", session!.user.id),
        where("status", "==", "completed"),
        where("reviewId", "==", null),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const fetchedBookings: BookingForReview[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBookings.push({ id: doc.id, ...doc.data() } as BookingForReview);
      });
      setBookingsForReview(fetchedBookings);
      if (fetchedBookings.length > 0) {
        setSelectedBooking(fetchedBookings[0]);
      }
    } catch (error) {
      console.error("Error fetching bookings for review:", error);
      // Mock
      setBookingsForReview([
        {
          id: "3",
          serviceName: "Office Cleaning",
          date: "2024-09-05",
        },
      ]);
      setSelectedBooking({
        id: "3",
        serviceName: "Office Cleaning",
        date: "2024-09-05",
      });
    }
  };

  const onSubmitReview = async (data: ReviewForm) => {
    if (!selectedBooking) return;

    setSubmitting(true);
    setMessage("");
    try {
      const reviewData = {
        userId: session!.user.id,
        bookingId: selectedBooking.id,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        serviceName: selectedBooking.serviceName,
        date: selectedBooking.date,
        createdAt: new Date().toISOString(),
        photos: [], // Implement photo upload
        verified: true,
        status: "approved",
      };

      const docRef = await addDoc(collection(db, "reviews"), reviewData);

      // Update booking
      await updateDoc(doc(db, "bookings", selectedBooking.id), {
        reviewId: docRef.id,
      });

      // Award points
      const userRef = doc(db, "users", session!.user.id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          loyaltyPoints: (userSnap.data()?.loyaltyPoints || 0) + 50,
        });
      }

      setMessage("Review submitted! Earned 50 loyalty points.");
      reset();
      setSelectedBooking(null);
      setShowForm(false);
      fetchReviews();
      fetchBookingsForReview();
    } catch (error: any) {
      setMessage("Failed to submit review: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;

    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews(reviews.filter(r => r.id !== id));
      setMessage("Review deleted.");
    } catch (error) {
      setMessage("Failed to delete review.");
    }
  };

  const editReview = (review: Review) => {
    setEditingReviewId(review.id);
    setValue("rating", review.rating);
    setValue("title", review.title);
    setValue("comment", review.comment);
    setShowForm(true);
    setSelectedBooking({ id: review.bookingId, serviceName: review.serviceName, date: review.date });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
        <span className="ml-2">Loading reviews...</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to manage reviews.</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-600 mb-6">Share your experience to help others and earn 50 bonus points!</p>
        {bookingsForReview.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Star className="h-5 w-5" />
            <span>Write a Review</span>
          </button>
        )}
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.includes("success") || message.includes("earned") ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <AlertCircle className="h-5 w-5 inline mr-2" />
          <span>{message}</span>
        </motion.div>
      )}

      {/* Review Form */}
      {showForm && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingReviewId ? "Edit Review" : "New Review"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingReviewId(null);
                setSelectedBooking(null);
                reset();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          {selectedBooking && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-medium">{selectedBooking.serviceName}</p>
              <p className="text-sm text-gray-600">{selectedBooking.date}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1 mb-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star)}
                    className={`p-2 rounded-full transition-colors ${
                      rating >= star ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Star size={20} fill={rating >= star ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                {...register("title")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g. Excellent deep clean!"
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                {...register("comment")}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.comment ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tell us about your experience..."
              />
              {errors.comment && <p className="text-sm text-red-600">{errors.comment.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Camera className="mr-2 h-4 w-4" />
                Photos (Optional - earn extra points!)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">Add up to 5 photos for 25 bonus points</p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : editingReviewId ? (
                <>
                  <Edit3 className="h-5 w-5" />
                  <span>Update Review</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </form>
        </motion.section>
      )}

      {/* Reviews List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Your Reviews ({reviews.length})</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex space-x-1 flex-shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{review.title}</h3>
                  <p className="text-gray-600 mb-3">{review.comment}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{session?.user.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className="capitalize">{review.serviceName}</span>
                  </div>
                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {review.photos.slice(0, 3).map((photo, i) => (
                        <img key={i} src={photo} alt="Review photo" className="rounded-lg h-20 object-cover" />
                      ))}
                      {review.photos.length > 3 && (
                        <div className="col-span-3 text-center text-sm text-gray-500">
                          +{review.photos.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editReview(review)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {reviews.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            No reviews yet. Your first review will earn you 50 bonus points!
          </div>
        )}
      </motion.section>

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

function editReview(review: Review) {
  setEditingReviewId(review.id);
  setValue("rating", review.rating);
  setValue("title", review.title);
  setValue("comment", review.comment);
  setShowForm(true);
  setSelectedBooking({ id: review.bookingId, serviceName: review.serviceName, date: review.date });
}

async function deleteReview(id: string) {
  if (!confirm("Delete this review?")) return;

  try {
    await deleteDoc(doc(db, "reviews", id));
    setReviews(reviews.filter(r => r.id !== id));
    setMessage("Review deleted successfully.");
  } catch (error) {
    setMessage("Failed to delete review.");
  }
}
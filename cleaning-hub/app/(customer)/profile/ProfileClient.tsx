"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Save, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number too short").max(20, "Phone number too long"),
  currentPassword: z.string().min(6, "Current password required").optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => !data.newPassword || data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ProfileClient() {
  const { data: session, update } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (session?.user.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const docRef = doc(db, "users", session!.user.id);
      // Assume user doc exists from registration
      // For demo, use session data
      setUserData({
        name: session?.user.name || "",
        email: session?.user.email || "",
        phone: "", // Fetch from Firestore in real
      });
      setValue("name", session?.user.name || "");
      setValue("email", session?.user.email || "");
      setValue("phone", "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not found");

      // Update profile name
      await updateProfile(user, { displayName: data.name });

      // Update email if changed
      if (data.email !== user.email) {
        await updateEmail(user, data.email);
      }

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        phone: data.phone,
        updatedAt: new Date().toISOString(),
      });

      // Update session
      await update({ user: { name: data.name, email: data.email } });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      reset(data);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile." });
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not found");

      // Reauthenticate
      const credential = EmailAuthProvider.credential(user.email!, data.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);

      setMessage({ type: "success", text: "Password changed successfully!" });
      setEditingPassword(false);
      setCurrentPassword("");
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to change password." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Update your account information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              <div className="flex items-center">
                {message.type === "error" && <AlertCircle className="h-5 w-5 mr-2" />}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              Phone Number
            </label>
            <input
              type="tel"
              {...register("phone")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <button
          onClick={() => setEditingPassword(!editingPassword)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          <Lock className="h-4 w-4" />
          <span>{editingPassword ? "Cancel" : "Change Password"}</span>
        </button>

        {editingPassword && (
          <form onSubmit={handleSubmit((data) => changePassword({ currentPassword, newPassword: data.newPassword! }))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                {...register("newPassword")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter new password"
              />
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>

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

async function changePassword(data: { currentPassword: string; newPassword: string }) {
  // Implementation in component
}
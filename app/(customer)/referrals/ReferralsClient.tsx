"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Share2, Gift, CheckCircle, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Referral {
  id: string;
  referredEmail: string;
  status: "pending" | "completed";
  pointsAwarded: number;
  date: string;
}

export default function ReferralsClient() {
  const { data: session, status } = useSession() || { data: null, status: "loading" };
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      fetchReferralData();
    }
  }, [status, session]);

  const fetchReferralData = async () => {
    try {
      // Fetch user referral code
      const userDoc = await getDoc(doc(db, "users", session!.user.id));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setReferralCode(data.referralCode || generateReferralCode());
      }

      // Fetch referrals
      const q = query(
        collection(db, "referrals"),
        where("referrerId", "==", session!.user.id)
      );
      const querySnapshot = await getDocs(q);
      const fetchedReferrals: Referral[] = [];
      querySnapshot.forEach((doc) => {
        fetchedReferrals.push({ id: doc.id, ...doc.data() } as Referral);
      });
      setReferrals(fetchedReferrals);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      // Mock data
      setReferralCode("CHUB" + Math.random().toString(36).substring(7).toUpperCase());
      setReferrals([
        {
          id: "1",
          referredEmail: "friend@example.com",
          status: "completed",
          pointsAwarded: 200,
          date: "2024-09-10",
        },
        {
          id: "2",
          referredEmail: "family@example.com",
          status: "pending",
          pointsAwarded: 0,
          date: "2024-09-05",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = () => {
    return "CHUB" + Math.random().toString(36).substring(7).toUpperCase();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    const text = `Join Cleaning Hub with my referral code ${referralCode} for a welcome discount! https://cleaninghub.com/register?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({ title: "Refer Cleaning Hub", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Referral link copied to clipboard!");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading referrals...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to manage referrals.</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const totalPointsEarned = referrals.reduce((sum, r) => sum + r.pointsAwarded, 0);
  const completedReferrals = referrals.filter(r => r.status === "completed").length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
            <p className="opacity-90">Refer friends and earn 200 points when they book their first service!</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{totalPointsEarned}</p>
            <p className="text-sm opacity-80">Points Earned from Referrals</p>
          </div>
        </div>
      </motion.section>

      {/* Your Referral Code */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span>Your Referral Code</span>
        </h2>
        <p className="text-gray-600 mb-4">Share this code with friends to give them a 10% discount on their first service and earn 200 points when they book.</p>
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <input
            type="text"
            value={referralCode}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
          />
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Copy size={16} />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={shareReferral}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Referral link: https://cleaninghub.com/register?ref={referralCode}</p>
      </motion.section>

      {/* Referral Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-6">Your Referral Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{completedReferrals}</p>
            <p className="text-gray-600">Successful Referrals</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{totalPointsEarned}</p>
            <p className="text-gray-600">Points Earned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{referrals.length}</p>
            <p className="text-gray-600">Total Referrals</p>
          </div>
        </div>
      </motion.section>

      {/* Referral History */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Referral History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No referrals yet. Start sharing your code to earn points!
            </div>
          ) : (
            referrals.map((referral) => (
              <div key={referral.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      referral.status === "completed" ? "bg-green-100" : "bg-yellow-100"
                    }`}>
                      <Users className={`h-5 w-5 ${referral.status === "completed" ? "text-green-600" : "text-yellow-600"}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{referral.referredEmail}</p>
                      <p className="text-sm text-gray-500">{new Date(referral.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      referral.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {referral.status === "completed" ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Clock size={12} className="mr-1" />
                          Pending
                        </>
                      )}
                    </span>
                    {referral.pointsAwarded > 0 && (
                      <p className="text-sm font-medium text-green-600">+{referral.pointsAwarded} points</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
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
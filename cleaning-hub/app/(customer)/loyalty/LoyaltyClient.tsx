"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Award, Gift, Users, Calendar, TrendingUp, Crown } from "lucide-react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface LoyaltyData {
  points: number;
  tier: string;
  tierThresholds: { [key: string]: number };
  rewards: Array<{
    id: string;
    name: string;
    description: string;
    pointsRequired: number;
    image?: string;
  }>;
  transactions: Array<{
    id: string;
    type: "earned" | "redeemed";
    points: number;
    description: string;
    date: string;
  }>;
}

export default function LoyaltyClient() {
  const { data: session, status } = useSession();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user.id) {
      fetchLoyaltyData();
    }
  }, [status, session]);

  const fetchLoyaltyData = async () => {
    try {
      // Fetch user loyalty data from Firestore
      const userQuery = query(collection(db, "users"), where("uid", "==", session!.user.id));
      const userSnapshot = await getDocs(userQuery);
      let userLoyalty = { points: 0, tier: "bronze" };
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].data();
        userLoyalty = { points: userDoc.loyaltyPoints || 0, tier: userDoc.loyaltyTier || "bronze" };
      }

      // Fetch rewards
      const rewardsQuery = query(collection(db, "loyaltyRewards"), where("active", "==", true));
      const rewardsSnapshot = await getDocs(rewardsQuery);
      const rewards = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as {
        id: string;
        name: string;
        description: string;
        pointsRequired: number;
        image?: string;
      }));

      // Fetch transactions
      const transactionsQuery = query(
        collection(db, "loyaltyTransactions"),
        where("userId", "==", session!.user.id),
        limit(10)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
      const transactions = transactionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as {
        id: string;
        type: "earned" | "redeemed";
        points: number;
        description: string;
        date: string;
      }));

      setLoyaltyData({
        points: userLoyalty.points,
        tier: userLoyalty.tier,
        tierThresholds: {
          bronze: 0,
          silver: 500,
          gold: 1500,
          platinum: 4000,
        },
        rewards,
        transactions,
      });
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
      // Fallback mock data
      setLoyaltyData({
        points: 1250,
        tier: "silver",
        tierThresholds: {
          bronze: 0,
          silver: 500,
          gold: 1500,
          platinum: 4000,
        },
        rewards: [
          { id: "1", name: "5% Discount", description: "On next service", pointsRequired: 200, image: "/discount.png" },
          { id: "2", name: "Free Add-on", description: "Choose one add-on service", pointsRequired: 500, image: "/addon.png" },
          { id: "3", name: "VIP Upgrade", description: "Upgrade to premium service", pointsRequired: 1000, image: "/vip.png" },
        ],
        transactions: [
          { id: "1", type: "earned", points: 150, description: "Booking completed", date: "2024-09-15" },
          { id: "2", type: "redeemed", points: -200, description: "Discount applied", date: "2024-09-10" },
          { id: "3", type: "earned", points: 100, description: "Review submitted", date: "2024-09-05" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading your loyalty information...</div>
      </div>
    );
  }

  if (!session || !loyaltyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your loyalty details.</p>
          <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const currentTier = loyaltyData.tier;
  const nextTier = Object.keys(loyaltyData.tierThresholds).find(tier => tier > currentTier && loyaltyData.points >= (loyaltyData.tierThresholds[tier as keyof typeof loyaltyData.tierThresholds] || 0)) || "platinum";
  const pointsToNextTier = (loyaltyData.tierThresholds[nextTier as keyof typeof loyaltyData.tierThresholds] || 0) - loyaltyData.points;

  const tierBenefits = {
    bronze: "Welcome bonus: 50 points | 1x multiplier | Basic rewards",
    silver: "1.25x multiplier | Priority booking | 5% discount | Birthday bonus: 100 points",
    gold: "1.5x multiplier | 10% discount | Free add-on monthly | Birthday bonus: 200 points | Exclusive offers",
    platinum: "2x multiplier | 15% discount | Free premium quarterly | Birthday bonus: 500 points | VIP support | Early access",
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Loyalty Program</h1>
            <p className="opacity-90">Earn points on every service and redeem exciting rewards!</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-center">
              <p className="text-2xl font-bold">{loyaltyData.points}</p>
              <p className="text-sm opacity-80">Total Points</p>
            </div>
            <div className="w-px h-8 bg-white opacity-30"></div>
            <div className="text-center">
              <p className="text-lg font-semibold capitalize">{currentTier}</p>
              <p className="text-sm opacity-80">Member Tier</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tier Progress */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span>Your Tier: {currentTier.toUpperCase()}</span>
        </h2>
        <p className="text-gray-600 mb-6">{tierBenefits[currentTier as keyof typeof tierBenefits]}</p>
        
        <div className="space-y-4">
          {Object.entries(loyaltyData.tierThresholds).map(([tier, threshold]) => (
            <div key={tier} className="flex items-center justify-between">
              <span className={`capitalize font-medium ${currentTier === tier ? "text-purple-600" : "text-gray-600"}`}>
                {tier} Tier
              </span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentTier === tier ? "bg-purple-600" : "bg-gray-300"
                    }`}
                    style={{ width: `${Math.min((loyaltyData.points / threshold) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">{threshold} points</span>
            </div>
          ))}
        </div>

        {pointsToNextTier > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">
                {pointsToNextTier} more points to reach {nextTier} tier!
              </span>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Available Rewards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
          <Gift className="h-5 w-5 text-green-600" />
          <span>Redeem Rewards</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loyaltyData.rewards.map((reward) => (
            <div key={reward.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {reward.image ? (
                  <img src={reward.image} alt={reward.name} className="h-full w-full object-cover rounded" />
                ) : (
                  <Gift className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{reward.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-green-600 font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{reward.pointsRequired} points</span>
                </div>
                <button
                  onClick={() => {/* Redeem logic */ alert(`Redeem ${reward.name} for ${reward.pointsRequired} points?`)}}
                  disabled={loyaltyData.points < reward.pointsRequired}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    loyaltyData.points >= reward.pointsRequired
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loyaltyData.points >= reward.pointsRequired ? "Redeem" : "Insufficient Points"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Recent Transactions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
        <div className="space-y-4">
          {loyaltyData.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === "earned" ? "bg-green-100" : "bg-red-100"
                }`}>
                  <Star className={`h-5 w-5 ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === "earned" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.type === "earned" ? "+" : "-"}{transaction.points} points
              </span>
            </div>
          ))}
        </div>
        {loyaltyData.transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions yet. Earn points by booking services!
          </div>
        )}
      </motion.section>

      {/* How to Earn Points */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-6">How to Earn More Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Service Bookings</p>
              <p className="text-gray-600">10-20 points per $10 spent (tier multiplier applies)</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Reviews</p>
              <p className="text-gray-600">50 bonus points for submitting a review + 25 for photos</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Referrals</p>
              <p className="text-gray-600">200 points when your referral books their first service</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Social Shares</p>
              <p className="text-gray-600">25 points for sharing your experience on social media</p>
            </div>
          </div>
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
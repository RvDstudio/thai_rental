"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Heart,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Mail,
  Calendar,
  Edit3,
  Check,
  X,
  Clock,
  Building,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useWishlist } from "@/contexts/WishlistContext";

type TabType = "details" | "wishlist" | "rentals";

interface RentalData {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  property: {
    name: string;
    location: string;
    image: string;
  } | null;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { items: wishlistItems, removeItem } = useWishlist();
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [rentals, setRentals] = useState<RentalData[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);

  // Fetch rentals when user is authenticated
  useEffect(() => {
    async function fetchRentals() {
      if (!session?.user) return;

      try {
        const response = await fetch("/api/rentals");
        if (response.ok) {
          const data = await response.json();
          setRentals(data);
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
      } finally {
        setRentalsLoading(false);
      }
    }

    if (session?.user) {
      fetchRentals();
    }
  }, [session?.user]);

  // Redirect if not logged in
  if (!isPending && !session?.user) {
    router.push("/sign-in");
    return null;
  }

  if (isPending) {
    return (
      <div className="container mx-auto px-6 md:px-0 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const activeRentals = rentals.filter((r) => r.status === "active");

  const handleStartEdit = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    // TODO: Call API to update user details
    setIsEditing(false);
  };

  const tabs = [
    { id: "details" as const, label: "User Details", icon: User },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { id: "rentals" as const, label: "My Rentals", icon: Home, count: rentals.length },
  ];

  return (
    <div className="container mx-auto px-6 md:px-0 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#122B45] mb-2">
          My <span className="text-[#9FC3E9]">Account</span>
        </h1>
        <p className="text-gray-500">Manage your profile, wishlist, and rental history</p>
      </div>

      {/* User Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[#122B45] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">{user?.name || "User"}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              {wishlistItems.length} saved
            </span>
            <span className="flex items-center gap-1">
              <Home size={14} className="text-[#122B45]" />
              {activeRentals.length} active rentals
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-[#122B45]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-[#122B45] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#122B45]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* User Details Tab */}
        {activeTab === "details" && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#122B45] border border-[#122B45] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#122B45] rounded-lg hover:bg-[#1a3d5c] transition-colors"
                  >
                    <Check size={16} />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <User size={14} className="inline mr-1" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user?.name || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Mail size={14} className="inline mr-1" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{user?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Calendar size={14} className="inline mr-1" />
                  Member Since
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Check size={14} className="inline mr-1" />
                  Email Verified
                </label>
                <p className="text-gray-900 font-medium">
                  {user?.emailVerified ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Check size={16} /> Verified
                    </span>
                  ) : (
                    <span className="text-amber-600">Not verified</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <WishlistCard key={item.id} item={item} onRemove={removeItem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-500 mb-6">
                  Start adding properties you love to your wishlist
                </p>
                <Link
                  href="/properties"
                  className="inline-block px-6 py-3 bg-[#122B45] text-white font-medium rounded-lg hover:bg-[#1a3d5c] transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Rentals Tab */}
        {activeTab === "rentals" && (
          <div>
            {rentalsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-gray-400" />
              </div>
            ) : rentals.length > 0 ? (
              <div className="space-y-4">
                {rentals.map((rental) => (
                  <RentalCard key={rental.id} rental={rental} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Building size={32} className="text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No rentals yet</h2>
                <p className="text-gray-500 mb-6">
                  When you rent a property, it will appear here
                </p>
                <Link
                  href="/properties"
                  className="inline-block px-6 py-3 bg-[#122B45] text-white font-medium rounded-lg hover:bg-[#1a3d5c] transition-colors"
                >
                  Browse Properties
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Wishlist Card Component
interface WishlistItem {
  id: string;
  name: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  price: number;
  type: string;
  image: string;
}

function WishlistCard({
  item,
  onRemove,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="group">
      <Link
        href={`/properties/${item.id}`}
        className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-linear-to-b from-sky-100 to-sky-50 block cursor-pointer"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {item.type}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="p-2 bg-red-50 text-red-500 rounded-full shadow-md hover:bg-red-100 transition-colors"
            aria-label="Remove from wishlist"
          >
            <Heart size={18} fill="currentColor" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-[#122B45] text-white rounded-lg text-sm font-semibold">
            ฿{item.price.toLocaleString()}/mo
          </span>
        </div>
      </Link>

      <Link href={`/properties/${item.id}`} className="block space-y-2">
        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin size={14} />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{item.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{item.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            <span>{item.area.toLocaleString()} ft²</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Rental Card Component
function RentalCard({ rental }: { rental: RentalData }) {
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-600",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    completed: "Completed",
    pending: "Pending",
    cancelled: "Cancelled",
  };

  if (!rental.property) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4">
      <Link
        href={`/properties/${rental.propertyId}`}
        className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0"
      >
        <Image
          src={rental.property.image}
          alt={rental.property.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/properties/${rental.propertyId}`}
              className="font-semibold text-gray-900 hover:text-[#122B45] transition-colors"
            >
              {rental.property.name}
            </Link>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin size={14} />
              <span>{rental.property.location}</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[rental.status] || statusColors.pending}`}
          >
            {statusLabels[rental.status] || rental.status}
          </span>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Monthly Rent</p>
            <p className="font-semibold text-[#122B45]">฿{rental.monthlyRent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Period</p>
            <p className="font-medium text-gray-900 flex items-center gap-1">
              <Clock size={14} />
              {new Date(rental.startDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(rental.endDate).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

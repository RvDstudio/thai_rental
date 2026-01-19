"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();

  return (
    <div className="container mx-auto px-6 md:px-0 py-8">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#122B45] mb-2">
            My <span className="text-[#9FC3E9]">Wishlist</span>
          </h1>
          <p className="text-gray-500">
            {items.length} {items.length === 1 ? "property" : "properties"} saved
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        )}
      </div>

      {/* Wishlist Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} onRemove={removeItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
  );
}

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
      {/* Image Container */}
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

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {item.type}
          </span>
        </div>

        {/* Remove Button */}
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

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-[#122B45] text-white rounded-lg text-sm font-semibold">
            ฿{item.price.toLocaleString()}/mo
          </span>
        </div>
      </Link>

      {/* Content */}
      <Link href={`/properties/${item.id}`} className="block space-y-2">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin size={14} />
          <span>{item.location}</span>
        </div>

        {/* Stats */}
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

"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, ShoppingCart, ArrowLeft, Check, Phone, Mail, Loader2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

interface Property {
  id: string;
  name: string;
  location: string;
  address: string;
  beds: number;
  baths: number;
  area: number;
  price: number;
  type: string;
  image: string;
  images: string[] | null;
  description: string | null;
  amenities: string[] | null;
}

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        } else if (response.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 md:px-0 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#122B45]" />
      </div>
    );
  }

  if (notFound || !property) {
    return (
      <div className="container mx-auto px-6 md:px-0 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-500 mb-8">The property you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={20} />
          Back to Properties
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(property.id);
  const wishlistItem = {
    id: property.id,
    name: property.name,
    location: property.location,
    beds: property.beds,
    baths: property.baths,
    area: property.area,
    price: property.price,
    type: property.type,
    image: property.image,
  };

  const images = property.images || [property.image];
  const amenities = property.amenities || [];

  return (
    <div className="container mx-auto px-6 md:px-0 py-8">
      {/* Back Button */}
      <Link
        href="/properties"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Properties
      </Link>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
          <Image
            src={images[0]}
            alt={property.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative aspect-4/3 rounded-xl overflow-hidden">
              <Image
                src={image}
                alt={`${property.name} ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                  {property.type}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(wishlistItem)}
                  className={`p-3 rounded-full transition-colors ${
                    isWishlisted
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-100 hover:bg-red-50 hover:text-red-500"
                  }`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
                <button
                  className="p-3 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-500 mb-4">
              <MapPin size={18} />
              <span>{property.address}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Bed size={20} />
                <span>{property.beds} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} />
                <span>{property.baths} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize size={20} />
                <span>{property.area.toLocaleString()} ft²</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <Check size={16} className="text-green-500" />
                    <span className="text-gray-700 text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Contact Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-[#122B45]">
                ฿{property.price.toLocaleString()}
                <span className="text-base font-normal text-gray-500">/month</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-4">
              <button className="w-full py-3 bg-[#122B45] text-white font-medium rounded-lg hover:bg-[#1a3d5c] transition-colors">
                Schedule a Tour
              </button>
              <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Request Info
              </button>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <a
                href="tel:+66812345678"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
              >
                <Phone size={18} />
                <span>+66 81 234 5678</span>
              </a>
              <a
                href="mailto:info@thairental.com"
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
              >
                <Mail size={18} />
                <span>info@thairental.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

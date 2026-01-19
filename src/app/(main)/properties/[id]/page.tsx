"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, ShoppingCart, ArrowLeft, Check, Phone, Mail } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

interface Rental {
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
  images: string[];
  description: string;
  amenities: string[];
}

const rentals: Record<string, Rental> = {
  "1": {
    id: "1",
    name: "Serene Haven Estates",
    location: "Downtown Metropolis",
    address: "123 Sukhumvit Road, Bangkok 10110",
    beds: 3,
    baths: 2,
    area: 1648,
    price: 25000,
    type: "House",
    image: "/images/rentals/rental1.jpg",
    images: ["/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Experience luxurious living in this stunning modern home. This beautifully designed property features spacious rooms, high ceilings, and premium finishes throughout. The open-plan living area seamlessly connects to a private garden, perfect for entertaining or relaxing. Located in a prime neighborhood with easy access to shopping, dining, and transportation.",
    amenities: ["Air Conditioning", "Swimming Pool", "Parking", "Garden", "Security", "Furnished", "WiFi", "Gym Access"],
  },
  "2": {
    id: "2",
    name: "Ocean View Villa",
    location: "Pattaya Beach",
    address: "456 Beach Road, Pattaya 20150",
    beds: 4,
    baths: 3,
    area: 2200,
    price: 45000,
    type: "Villa",
    image: "/images/rentals/rental2.jpg",
    images: ["/images/rentals/rental2.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Wake up to breathtaking ocean views in this luxurious beachfront villa. This exceptional property offers the perfect blend of indoor and outdoor living, with expansive terraces overlooking the sea. The villa features premium amenities, a private pool, and direct beach access. Ideal for those seeking a resort-style lifestyle.",
    amenities: ["Ocean View", "Private Pool", "Beach Access", "Air Conditioning", "Furnished", "Security", "Parking", "BBQ Area"],
  },
  "3": {
    id: "3",
    name: "Modern City Condo",
    location: "Bangkok Central",
    address: "789 Silom Road, Bangkok 10500",
    beds: 2,
    baths: 1,
    area: 850,
    price: 15000,
    type: "Condo",
    image: "/images/rentals/rental3.jpg",
    images: ["/images/rentals/rental3.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental4.jpg"],
    description: "Live in the heart of Bangkok in this stylish modern condo. Perfect for young professionals, this unit offers contemporary design, efficient layout, and access to excellent building amenities. Walking distance to BTS station, shopping malls, and vibrant nightlife. A smart choice for urban living.",
    amenities: ["Air Conditioning", "Gym Access", "Swimming Pool", "24/7 Security", "Parking", "Furnished", "Near BTS", "Laundry"],
  },
  "4": {
    id: "4",
    name: "Tropical Garden House",
    location: "Chiang Mai",
    address: "321 Nimmanhaemin Road, Chiang Mai 50200",
    beds: 3,
    baths: 2,
    area: 1800,
    price: 20000,
    type: "House",
    image: "/images/rentals/rental4.jpg",
    images: ["/images/rentals/rental4.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg"],
    description: "Escape to this charming tropical house surrounded by lush gardens. This peaceful retreat offers traditional Thai architecture with modern comforts. Enjoy the serene atmosphere while being close to Chiang Mai's famous cafes, restaurants, and cultural attractions. Perfect for those who appreciate nature and tranquility.",
    amenities: ["Garden", "Air Conditioning", "Parking", "Furnished", "Pet Friendly", "Mountain View", "WiFi", "Storage"],
  },
  "5": {
    id: "5",
    name: "Luxury Penthouse",
    location: "Bangkok Central",
    address: "555 Sathorn Road, Bangkok 10120",
    beds: 4,
    baths: 3,
    area: 3000,
    price: 80000,
    type: "Condo",
    image: "/images/rentals/rental1.jpg",
    images: ["/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Experience the pinnacle of luxury living in this stunning penthouse. Featuring panoramic city views, designer interiors, and world-class amenities. This exclusive residence offers unparalleled sophistication with private elevator access, a wraparound terrace, and premium finishes throughout. For the most discerning residents.",
    amenities: ["City View", "Private Elevator", "Terrace", "Air Conditioning", "Concierge", "Gym Access", "Swimming Pool", "Wine Cellar"],
  },
  "6": {
    id: "6",
    name: "Riverside Retreat",
    location: "Chiang Mai",
    address: "888 Ping River Road, Chiang Mai 50300",
    beds: 2,
    baths: 2,
    area: 1200,
    price: 18000,
    type: "House",
    image: "/images/rentals/rental2.jpg",
    images: ["/images/rentals/rental2.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Discover tranquility at this charming riverside property. Wake up to the gentle sounds of the Ping River and enjoy your morning coffee on the private deck. This cozy home combines rustic charm with modern amenities, offering a perfect escape from city life while remaining conveniently located.",
    amenities: ["River View", "Private Deck", "Garden", "Air Conditioning", "Furnished", "Parking", "WiFi", "Kayak Access"],
  },
  "7": {
    id: "7",
    name: "Beachfront Bungalow",
    location: "Pattaya Beach",
    address: "999 Jomtien Beach Road, Pattaya 20250",
    beds: 1,
    baths: 1,
    area: 600,
    price: 12000,
    type: "Villa",
    image: "/images/rentals/rental3.jpg",
    images: ["/images/rentals/rental3.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental4.jpg"],
    description: "Your own slice of paradise awaits in this cozy beachfront bungalow. Step directly onto the sand from your private terrace and enjoy stunning sunset views every evening. This intimate retreat is perfect for couples or solo travelers seeking a peaceful beach lifestyle with all essential comforts.",
    amenities: ["Beach Access", "Ocean View", "Terrace", "Air Conditioning", "Furnished", "WiFi", "Outdoor Shower", "Hammock"],
  },
  "8": {
    id: "8",
    name: "Mountain View Estate",
    location: "Chiang Mai",
    address: "777 Doi Suthep Road, Chiang Mai 50200",
    beds: 5,
    baths: 4,
    area: 3500,
    price: 55000,
    type: "Villa",
    image: "/images/rentals/rental4.jpg",
    images: ["/images/rentals/rental4.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg"],
    description: "Live among the clouds in this magnificent mountain estate. This grand property offers sweeping views of Doi Suthep and the surrounding valleys. With generous living spaces, a private infinity pool, and beautifully landscaped gardens, this estate provides an unmatched living experience for those who desire space and luxury.",
    amenities: ["Mountain View", "Infinity Pool", "Garden", "Air Conditioning", "Furnished", "Security", "Parking", "Home Office"],
  },
};

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const rental = rentals[id];
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!rental) {
    return (
      <div className="container mx-auto px-6 md:px-0 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
        <p className="text-gray-500 mb-8">The property you're looking for doesn't exist.</p>
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

  const isWishlisted = isInWishlist(rental.id);
  const wishlistItem = {
    id: rental.id,
    name: rental.name,
    location: rental.location,
    beds: rental.beds,
    baths: rental.baths,
    area: rental.area,
    price: rental.price,
    type: rental.type,
    image: rental.image,
  };

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
            src={rental.images[0]}
            alt={rental.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {rental.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative aspect-4/3 rounded-xl overflow-hidden">
              <Image
                src={image}
                alt={`${rental.name} ${index + 2}`}
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
                  {rental.type}
                </span>
                <h1 className="text-3xl font-bold text-gray-900">{rental.name}</h1>
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
              <span>{rental.address}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Bed size={20} />
                <span>{rental.beds} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={20} />
                <span>{rental.baths} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize size={20} />
                <span>{rental.area.toLocaleString()} ft²</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About this property</h2>
            <p className="text-gray-600 leading-relaxed">{rental.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {rental.amenities.map((amenity) => (
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
        </div>

        {/* Sidebar - Contact Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Price */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-[#122B45]">
                ฿{rental.price.toLocaleString()}
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

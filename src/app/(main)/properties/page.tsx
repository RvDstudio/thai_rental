"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, ShoppingCart, ChevronDown, SlidersHorizontal, Loader2 } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

interface Property {
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

const locations = ["All Locations", "Bangkok Central", "Pattaya Beach", "Chiang Mai", "Downtown Metropolis"];
const propertyTypes = ["All Types", "House", "Condo", "Villa"];
const bedroomOptions = ["Any Beds", "1+", "2+", "3+", "4+", "5+"];
const priceRanges = ["Any Price", "Under ฿20,000", "฿20,000 - ฿40,000", "฿40,000 - ฿60,000", "Over ฿60,000"];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState("All Locations");
  const [propertyType, setPropertyType] = useState("All Types");
  const [bedrooms, setBedrooms] = useState("Any Beds");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch("/api/properties");
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) => {
    // Location filter
    if (location !== "All Locations" && property.location !== location) {
      return false;
    }

    // Property type filter
    if (propertyType !== "All Types" && property.type !== propertyType) {
      return false;
    }

    // Bedrooms filter
    if (bedrooms !== "Any Beds") {
      const minBeds = parseInt(bedrooms);
      if (property.beds < minBeds) {
        return false;
      }
    }

    // Price range filter
    if (priceRange !== "Any Price") {
      if (priceRange === "Under ฿20,000" && property.price >= 20000) return false;
      if (priceRange === "฿20,000 - ฿40,000" && (property.price < 20000 || property.price > 40000)) return false;
      if (priceRange === "฿40,000 - ฿60,000" && (property.price < 40000 || property.price > 60000)) return false;
      if (priceRange === "Over ฿60,000" && property.price <= 60000) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setLocation("All Locations");
    setPropertyType("All Types");
    setBedrooms("Any Beds");
    setPriceRange("Any Price");
  };

  const hasActiveFilters =
    location !== "All Locations" ||
    propertyType !== "All Types" ||
    bedrooms !== "Any Beds" ||
    priceRange !== "Any Price";

  const activeFilterCount = [
    location !== "All Locations",
    propertyType !== "All Types",
    bedrooms !== "Any Beds",
    priceRange !== "Any Price",
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 md:px-0 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#122B45]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-0 py-8">
      {/* Page Header with Filters Dropdown */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-0">
          <h1 className="text-3xl font-bold text-[#122B45]">
            Available <span className="text-[#9FC3E9]">Properties</span>
          </h1>

          {/* Filters Dropdown */}
          <div className="flex flex-col items-end">
            <div className="relative">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                <SlidersHorizontal size={18} className="text-gray-500" />
                <span className="font-medium text-gray-700">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFiltersOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsFiltersOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-700">Filters</span>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <FilterDropdown
                        label="Location"
                        value={location}
                        options={locations}
                        onChange={setLocation}
                      />
                      <FilterDropdown
                        label="Property Type"
                        value={propertyType}
                        options={propertyTypes}
                        onChange={setPropertyType}
                      />
                      <FilterDropdown
                        label="Bedrooms"
                        value={bedrooms}
                        options={bedroomOptions}
                        onChange={setBedrooms}
                      />
                      <FilterDropdown
                        label="Price Range"
                        value={priceRange}
                        options={priceRanges}
                        onChange={setPriceRange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        <p className="text-gray-500">Find your perfect rental property</p>
        <p className="text-gray-600 text-sm mt-1">
          Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties
        </p>
      </div>

      {/* Ad Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#122B45] rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Find Your Dream Home</h3>
          <p className="text-white/80 text-sm mb-4">
            Explore our exclusive listings with premium amenities and prime locations.
          </p>
          <button className="bg-[#9FC3E9] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors">
            Learn More
          </button>
        </div>
        <div className="bg-[#9FC3E9] rounded-2xl p-6 text-[#122B45]">
          <h3 className="text-xl font-bold mb-2">Special Offers Available</h3>
          <p className="text-[#122B45]/80 text-sm mb-4">
            Get up to 20% off on your first month rent. Limited time offer!
          </p>
          <button className="bg-[#122B45] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#1a3d5c] transition-colors">
            View Deals
          </button>
        </div>
      </div>

      {/* Property Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No properties found matching your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-gray-700 truncate">{value}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${value === option ? "bg-blue-50 text-blue-600" : "text-gray-700"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(property.id);

  return (
    <div className="group">
      {/* Image Container */}
      <Link
        href={`/properties/${property.id}`}
        className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-linear-to-b from-sky-100 to-sky-50 block cursor-pointer"
      >
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {property.type}
          </span>
        </div>

        {/* Hover Icons */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property);
            }}
            className={`p-2 rounded-full shadow-md transition-colors ${isWishlisted
              ? "bg-red-50 text-red-500"
              : "bg-white hover:bg-red-50 hover:text-red-500"
              }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 hover:text-blue-500 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 bg-[#122B45] text-white rounded-lg text-sm font-semibold">
            ฿{property.price.toLocaleString()}/mo
          </span>
        </div>
      </Link>

      {/* Content */}
      <Link href={`/properties/${property.id}`} className="block space-y-2">
        {/* Title and View More */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{property.name}</h3>
          <span className="text-sm text-blue-600 hover:text-blue-700 hover:underline shrink-0 ml-2">
            View More
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin size={14} />
          <span>{property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            <span>{property.area.toLocaleString()} ft²</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

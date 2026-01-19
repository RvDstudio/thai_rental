"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, Star, Loader2, X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  Map,
  MapTileLayer,
  MapMarker,
  MapPopup,
  MapZoomControl,
} from "@/components/ui/map";
import { useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

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

// Location coordinates for Thai locations
const locationCoordinates: Record<string, [number, number]> = {
  "Pattaya Beach": [12.9236, 100.8825],
  "Pattaya": [12.9236, 100.8825],
  "Bangkok Central": [13.7563, 100.5018],
  "Bangkok": [13.7563, 100.5018],
  "Chiang Mai": [18.7883, 98.9853],
  "Downtown Metropolis": [13.7563, 100.5018],
  "Phuket": [7.8804, 98.3923],
  "Koh Samui": [9.5120, 100.0136],
  "Hua Hin": [12.5684, 99.9577],
};

const propertyTypes = ["All Types", "House", "Condo", "Villa", "Apartment"];
const priceRanges = ["Any Price", "Under ฿20,000", "฿20,000 - ฿40,000", "฿40,000 - ฿60,000", "Over ฿60,000"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyType, setPropertyType] = useState("All Types");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

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

  // Memoize property coordinates so they don't change on re-render
  const propertyCoordinates = useMemo(() => {
    const coordsMap: Record<string, [number, number]> = {};
    for (const property of properties) {
      coordsMap[property.id] = generatePropertyCoordinates(property);
    }
    return coordsMap;
  }, [properties]);

  // Filter properties based on search query and filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter (location-based)
      if (query) {
        const searchLower = query.toLowerCase();
        const matchesLocation = property.location.toLowerCase().includes(searchLower);
        const matchesName = property.name.toLowerCase().includes(searchLower);
        if (!matchesLocation && !matchesName) {
          return false;
        }
      }

      // Property type filter
      if (propertyType !== "All Types" && property.type !== propertyType) {
        return false;
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
  }, [properties, query, propertyType, priceRange]);

  // Calculate map center based on search query or filtered properties
  const mapCenter = useMemo((): [number, number] => {
    if (query) {
      // Try to find coordinates for the search query
      const queryLower = query.toLowerCase();
      for (const [location, coords] of Object.entries(locationCoordinates)) {
        if (location.toLowerCase().includes(queryLower) || queryLower.includes(location.toLowerCase())) {
          return coords;
        }
      }
    }
    
    // Default to Thailand center or first property location
    if (filteredProperties.length > 0) {
      const firstProperty = filteredProperties[0];
      for (const [location, coords] of Object.entries(locationCoordinates)) {
        if (firstProperty.location.includes(location) || location.includes(firstProperty.location)) {
          return coords;
        }
      }
    }
    
    return [13.7563, 100.5018]; // Default: Bangkok
  }, [query, filteredProperties]);

  const clearFilters = () => {
    setPropertyType("All Types");
    setPriceRange("Any Price");
  };

  const hasActiveFilters = propertyType !== "All Types" || priceRange !== "Any Price";

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#122B45]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {query ? (
                <>
                  Results for <span className="font-semibold text-gray-900">&quot;{query}&quot;</span>
                </>
              ) : (
                "All properties"
              )}
            </p>
            <p className="text-gray-600 text-sm mt-0.5">
              <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties found
            </p>
          </div>

          {/* Filters */}
          <div className="relative">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[#122B45] rounded-full" />
              )}
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isFiltersOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFiltersOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-700">Filters</span>
                    {hasActiveFilters && (
                      <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Property Type</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#122B45]/20"
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price Range</label>
                      <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#122B45]/20"
                      >
                        {priceRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Listings Panel */}
        <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-gray-50">
          <div className="p-4 space-y-4">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isHovered={hoveredProperty === property.id}
                  onHover={() => setHoveredProperty(property.id)}
                  onLeave={() => setHoveredProperty(null)}
                />
              ))
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No properties found matching your search.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Map Panel */}
        <div className="w-1/2 relative">
          <Map center={mapCenter} zoom={12} className="h-full w-full !rounded-none">
            <MapTileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapZoomControl />
            <FitBoundsToMarkers properties={filteredProperties} coordinatesMap={propertyCoordinates} />
            {filteredProperties.map((property) => {
              const coords = propertyCoordinates[property.id];
              if (!coords) return null;
              
              return (
                <MapMarker
                  key={property.id}
                  position={coords}
                  icon={
                    <div
                      style={{ width: 'max-content' }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border transition-all cursor-pointer whitespace-nowrap ${
                        hoveredProperty === property.id
                          ? "bg-[#122B45] text-white scale-110 border-[#122B45]"
                          : "bg-white text-gray-900 hover:scale-105 border-gray-200"
                      }`}
                    >
                      ฿{(property.price / 1000).toFixed(0)}K
                    </div>
                  }
                  iconAnchor={[30, 14]}
                >
                  <MapPopup>
                    <Link href={`/properties/${property.id}`} className="block w-64">
                      <div className="relative h-32 rounded-t-lg overflow-hidden -mx-4 -mt-4 mb-3">
                        <Image
                          src={property.image}
                          alt={property.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{property.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                        <MapPin size={12} />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Bed size={12} />
                          {property.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath size={12} />
                          {property.baths}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize size={12} />
                          {property.area} ft²
                        </span>
                      </div>
                      <p className="font-bold text-[#122B45]">
                        ฿{property.price.toLocaleString()}<span className="text-gray-500 font-normal text-sm">/mo</span>
                      </p>
                    </Link>
                  </MapPopup>
                </MapMarker>
              );
            })}
          </Map>
        </div>
      </div>
    </div>
  );
}

// Component to auto-fit map bounds to markers
function FitBoundsToMarkers({ 
  properties, 
  coordinatesMap 
}: { 
  properties: Property[];
  coordinatesMap: Record<string, [number, number]>;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length === 0) return;
    
    // Get all valid coordinates from the memoized map
    const coordinates = properties
      .map(p => coordinatesMap[p.id])
      .filter((coords): coords is [number, number] => coords !== undefined);
    
    if (coordinates.length === 0) return;
    
    // Create bounds from coordinates
    const bounds: LatLngBoundsExpression = coordinates.map(([lat, lng]) => [lat, lng] as [number, number]);
    
    // Fit map to bounds with padding
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15, // Don't zoom in too much
    });
  }, [map, properties, coordinatesMap]);
  
  return null;
}

// Generate coordinates for a property with a small random offset (called once per property)
function generatePropertyCoordinates(property: Property): [number, number] {
  // Try to find matching coordinates with some fuzzy matching
  for (const [location, coords] of Object.entries(locationCoordinates)) {
    if (
      property.location.toLowerCase().includes(location.toLowerCase()) ||
      location.toLowerCase().includes(property.location.toLowerCase())
    ) {
      // Add small random offset so markers don't stack exactly
      const offset = () => (Math.random() - 0.5) * 0.02;
      return [coords[0] + offset(), coords[1] + offset()];
    }
  }
  
  // Default coordinates for unknown locations (Bangkok area with offset)
  const offset = () => (Math.random() - 0.5) * 0.1;
  return [13.7563 + offset(), 100.5018 + offset()];
}

function PropertyCard({
  property,
  isHovered,
  onHover,
  onLeave,
}: {
  property: Property;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(property.id);

  return (
    <Link
      href={`/properties/${property.id}`}
      className={`block bg-white rounded-xl overflow-hidden border transition-all ${
        isHovered ? "border-[#122B45] shadow-lg" : "border-gray-200 hover:shadow-md"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-72 h-48 shrink-0">
          <Image
            src={property.image}
            alt={property.name}
            fill
            className="object-cover"
          />
          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${
              isWishlisted ? "bg-red-50 text-red-500" : "bg-white/90 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          
          {/* Guest favorite badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              {property.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{property.name}</h3>
              <div className="flex items-center gap-1 text-sm shrink-0 ml-2">
                <Star size={14} className="fill-gray-900 text-gray-900" />
                <span className="font-medium">4.9</span>
                <span className="text-gray-500">(28)</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
              <MapPin size={14} />
              {property.location}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Bed size={14} />
                {property.beds} beds
              </span>
              <span className="flex items-center gap-1">
                <Bath size={14} />
                {property.baths} baths
              </span>
              <span className="flex items-center gap-1">
                <Maximize size={14} />
                {property.area.toLocaleString()} ft²
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-lg font-bold text-gray-900">
              ฿{property.price.toLocaleString()}
              <span className="text-gray-500 font-normal text-sm">/month</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

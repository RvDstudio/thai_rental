"use client";

import { useState } from "react";
import { X, Upload, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddPropertyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const propertyTypes = ["House", "Condo", "Villa", "Apartment"];
const availableAmenities = [
  "Air Conditioning",
  "Swimming Pool",
  "Parking",
  "Garden",
  "Security",
  "Furnished",
  "WiFi",
  "Gym Access",
  "Ocean View",
  "Mountain View",
  "City View",
  "Private Pool",
  "Beach Access",
  "Pet Friendly",
  "Laundry",
  "Near BTS",
  "Terrace",
  "Balcony",
];

export function AddPropertyDrawer({ isOpen, onClose }: AddPropertyDrawerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    beds: "",
    baths: "",
    area: "",
    price: "",
    type: "House",
    image: "/images/rentals/rental1.jpg",
    description: "",
    isAvailable: true,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amenities: selectedAmenities,
          images: [formData.image],
        }),
      });

      if (response.ok) {
        router.refresh();
        onClose();
        // Reset form
        setFormData({
          name: "",
          location: "",
          address: "",
          beds: "",
          baths: "",
          area: "",
          price: "",
          type: "House",
          image: "/images/rentals/rental1.jpg",
          description: "",
          isAvailable: true,
        });
        setSelectedAmenities([]);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Failed to create property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Property</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="h-[calc(100%-140px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Two Column Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Ocean View Villa"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Bangkok Central"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 123 Sukhumvit Road, Bangkok 10110"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Price (THB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="e.g., 25000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Beds *
                    </label>
                    <input
                      type="number"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="3"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Baths *
                    </label>
                    <input
                      type="number"
                      name="baths"
                      value={formData.baths}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="2"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area (ft²) *
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="1500"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="/images/rentals/rental1.jpg"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
                    />
                    <button
                      type="button"
                      className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Upload size={18} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the property..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 text-[#122B45] focus:ring-[#122B45]"
                  />
                  <label htmlFor="isAvailable" className="text-sm text-gray-700">
                    Available for rent
                  </label>
                </div>
              </div>
            </div>

            {/* Amenities - Full Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? "bg-[#122B45] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {selectedAmenities.includes(amenity) && (
                      <Plus size={14} className="inline mr-1 rotate-45" />
                    )}
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-[#122B45] text-white rounded-lg hover:bg-[#1a3d5c] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? "Creating..." : "Create Property"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

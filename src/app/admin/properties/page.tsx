import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { desc, count, eq } from "drizzle-orm";
import { Search, Filter, MapPin, Bed, Bath, Maximize, Building, Home, Castle } from "lucide-react";
import Image from "next/image";
import { PropertiesHeader } from "./PropertiesHeader";

async function getProperties() {
  const properties = await db
    .select()
    .from(property)
    .orderBy(desc(property.createdAt));

  const [totalCount] = await db.select({ count: count() }).from(property);
  const [availableCount] = await db
    .select({ count: count() })
    .from(property)
    .where(eq(property.isAvailable, true));

  const [houseCount] = await db
    .select({ count: count() })
    .from(property)
    .where(eq(property.type, "House"));

  const [condoCount] = await db
    .select({ count: count() })
    .from(property)
    .where(eq(property.type, "Condo"));

  const [villaCount] = await db
    .select({ count: count() })
    .from(property)
    .where(eq(property.type, "Villa"));

  return {
    properties,
    totalCount: totalCount.count,
    availableCount: availableCount.count,
    houseCount: houseCount.count,
    condoCount: condoCount.count,
    villaCount: villaCount.count,
  };
}

export default async function AdminPropertiesPage() {
  const { properties, totalCount, availableCount, houseCount, condoCount, villaCount } = await getProperties();

  return (
    <div>
      {/* Page Header */}
      <PropertiesHeader />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-2xl font-bold text-green-600">{availableCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Home size={14} />
            <span>Houses</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{houseCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Building size={14} />
            <span>Condos</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{condoCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Castle size={14} />
            <span>Villas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{villaCount}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#122B45]/20 focus:border-[#122B45]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {/* Properties Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Property
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Details
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {p.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                          <MapPin size={12} />
                          {p.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        p.type === "House"
                          ? "bg-blue-100 text-blue-700"
                          : p.type === "Condo"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.type === "House" && <Home size={12} />}
                      {p.type === "Condo" && <Building size={12} />}
                      {p.type === "Villa" && <Castle size={12} />}
                      {p.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Bed size={14} />
                        {p.beds}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={14} />
                        {p.baths}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize size={14} />
                        {p.area.toLocaleString()} ft²
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      ฿{p.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">/mo</span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.isAvailable ? "Available" : "Rented"}
                    </span>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No properties found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

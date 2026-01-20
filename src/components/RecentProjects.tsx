"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize, Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useWishlist } from "@/contexts/WishlistContext";

interface Project {
  id: string;
  name: string;
  nameTh: string | null;
  location: string;
  locationTh: string | null;
  beds: number;
  baths: number;
  area: number;
  price: number;
  type: string;
  image: string;
}

export function RecentProjects() {
  const t = useTranslations("recentProjects");
  const tProps = useTranslations("properties");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/properties", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          // Only show first 4 projects
          setProjects(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 pt-4">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#122B45]" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 pt-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            {t("subtitle")}
          </p>
          <h2 className="text-3xl text-[#122B45]">{t("titlePart1")} <span className="text-[#9FC3E9]">{t("titlePart2")}</span></h2>
        </div>
        <Link
          href="/properties"
          className="px-6 py-3 bg-[#122B45] text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          {t("viewAll")}
        </Link>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const t = useTranslations("properties");
  const locale = useLocale();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(project.id);

  // Get localized name and location
  const displayName = locale === "th" && project.nameTh ? project.nameTh : project.name;
  const displayLocation = locale === "th" && project.locationTh ? project.locationTh : project.location;

  return (
    <div className="group">
      {/* Image Container */}
      <Link
        href={`/properties/${project.id}`}
        className="relative aspect-square mb-4 rounded-2xl overflow-hidden bg-linear-to-b from-sky-100 to-sky-50 block cursor-pointer"
      >
        <Image
          src={project.image}
          alt={displayName}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Icons */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
            isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          onClick={(e) => e.preventDefault()}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(project);
            }}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isWishlisted
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
      </Link>

      {/* Content */}
      <Link href={`/properties/${project.id}`} className="block space-y-2">
        {/* Title and View More */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{displayName}</h3>
          <span className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
            {t("viewMore")}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <MapPin size={14} />
          <span>{displayLocation}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{project.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{project.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize size={16} />
            <span>{project.area.toLocaleString()} {t("area")}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

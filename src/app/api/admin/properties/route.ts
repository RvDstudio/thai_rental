import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-server";
import crypto from "crypto";

const ALLOWED_IMAGE_DOMAINS = [
  "images.unsplash.com",
  "lh3.googleusercontent.com",
];

function isValidImageUrl(url: string): boolean {
  // Allow local paths
  if (url.startsWith("/")) {
    // Prevent path traversal
    if (url.includes("..") || url.includes("//")) {
      return false;
    }
    return true;
  }

  // Validate external URLs
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return false;
    }
    return ALLOWED_IMAGE_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();

  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const defaultImage = "/images/rentals/rental1.jpg";
    const image = body.image && isValidImageUrl(body.image) ? body.image : defaultImage;
    const images = Array.isArray(body.images)
      ? body.images.filter(isValidImageUrl)
      : [defaultImage];

    if (images.length === 0) {
      images.push(defaultImage);
    }

    const newProperty = {
      id: crypto.randomUUID(),
      name: body.name,
      location: body.location,
      address: body.address,
      beds: parseInt(body.beds),
      baths: parseInt(body.baths),
      area: parseInt(body.area),
      price: parseInt(body.price),
      type: body.type,
      image,
      images,
      description: body.description || null,
      amenities: body.amenities || [],
      isAvailable: body.isAvailable ?? true,
    };

    await db.insert(property).values(newProperty);

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { requireAdmin } from "@/lib/auth-server";
import crypto from "crypto";

export async function POST(request: Request) {
  const authResult = await requireAdmin();

  if (!authResult.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

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
      image: body.image || "/images/rentals/rental1.jpg",
      images: body.images || ["/images/rentals/rental1.jpg"],
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

import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const properties = await db
      .select({
        id: property.id,
        name: property.name,
        nameTh: property.nameTh,
        location: property.location,
        locationTh: property.locationTh,
        beds: property.beds,
        baths: property.baths,
        area: property.area,
        price: property.price,
        type: property.type,
        image: property.image,
        isAvailable: property.isAvailable,
      })
      .from(property)
      .where(eq(property.isAvailable, true));

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

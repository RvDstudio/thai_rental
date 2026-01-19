import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { rental, property } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth-server";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRentals = await db
      .select({
        id: rental.id,
        propertyId: rental.propertyId,
        startDate: rental.startDate,
        endDate: rental.endDate,
        monthlyRent: rental.monthlyRent,
        status: rental.status,
        property: {
          name: property.name,
          location: property.location,
          image: property.image,
        },
      })
      .from(rental)
      .leftJoin(property, eq(rental.propertyId, property.id))
      .where(eq(rental.userId, session.user.id));

    return NextResponse.json(userRentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}

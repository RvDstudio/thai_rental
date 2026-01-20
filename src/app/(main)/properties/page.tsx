import { db } from "@/db/drizzle";
import { property } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PropertiesClient } from "./PropertiesClient";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
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
    })
    .from(property)
    .where(eq(property.isAvailable, true));

  return <PropertiesClient initialProperties={properties} />;
}

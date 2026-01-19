import "dotenv/config";
import { db } from "../db/drizzle";
import { property, rental, user } from "../db/schema";

const allProperties = [
  {
    id: "1",
    name: "Serene Haven Estates",
    location: "Downtown Metropolis",
    address: "123 Sukhumvit Road, Bangkok 10110",
    beds: 3,
    baths: 2,
    area: 1648,
    price: 25000,
    type: "House",
    image: "/images/rentals/rental1.jpg",
    images: ["/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Experience luxurious living in this stunning modern home. This beautifully designed property features spacious rooms, high ceilings, and premium finishes throughout. The open-plan living area seamlessly connects to a private garden, perfect for entertaining or relaxing. Located in a prime neighborhood with easy access to shopping, dining, and transportation.",
    amenities: ["Air Conditioning", "Swimming Pool", "Parking", "Garden", "Security", "Furnished", "WiFi", "Gym Access"],
    isAvailable: true,
  },
  {
    id: "2",
    name: "Ocean View Villa",
    location: "Pattaya Beach",
    address: "456 Beach Road, Pattaya 20150",
    beds: 4,
    baths: 3,
    area: 2200,
    price: 45000,
    type: "Villa",
    image: "/images/rentals/rental2.jpg",
    images: ["/images/rentals/rental2.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Wake up to breathtaking ocean views in this luxurious beachfront villa. This exceptional property offers the perfect blend of indoor and outdoor living, with expansive terraces overlooking the sea. The villa features premium amenities, a private pool, and direct beach access. Ideal for those seeking a resort-style lifestyle.",
    amenities: ["Ocean View", "Private Pool", "Beach Access", "Air Conditioning", "Furnished", "Security", "Parking", "BBQ Area"],
    isAvailable: true,
  },
  {
    id: "3",
    name: "Modern City Condo",
    location: "Bangkok Central",
    address: "789 Silom Road, Bangkok 10500",
    beds: 2,
    baths: 1,
    area: 850,
    price: 15000,
    type: "Condo",
    image: "/images/rentals/rental3.jpg",
    images: ["/images/rentals/rental3.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental4.jpg"],
    description: "Live in the heart of Bangkok in this stylish modern condo. Perfect for young professionals, this unit offers contemporary design, efficient layout, and access to excellent building amenities. Walking distance to BTS station, shopping malls, and vibrant nightlife. A smart choice for urban living.",
    amenities: ["Air Conditioning", "Gym Access", "Swimming Pool", "24/7 Security", "Parking", "Furnished", "Near BTS", "Laundry"],
    isAvailable: true,
  },
  {
    id: "4",
    name: "Tropical Garden House",
    location: "Chiang Mai",
    address: "321 Nimmanhaemin Road, Chiang Mai 50200",
    beds: 3,
    baths: 2,
    area: 1800,
    price: 20000,
    type: "House",
    image: "/images/rentals/rental4.jpg",
    images: ["/images/rentals/rental4.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg"],
    description: "Escape to this charming tropical house surrounded by lush gardens. This peaceful retreat offers traditional Thai architecture with modern comforts. Enjoy the serene atmosphere while being close to Chiang Mai's famous cafes, restaurants, and cultural attractions. Perfect for those who appreciate nature and tranquility.",
    amenities: ["Garden", "Air Conditioning", "Parking", "Furnished", "Pet Friendly", "Mountain View", "WiFi", "Storage"],
    isAvailable: true,
  },
  {
    id: "5",
    name: "Luxury Penthouse",
    location: "Bangkok Central",
    address: "555 Sathorn Road, Bangkok 10120",
    beds: 4,
    baths: 3,
    area: 3000,
    price: 80000,
    type: "Condo",
    image: "/images/rentals/rental1.jpg",
    images: ["/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Experience the pinnacle of luxury living in this stunning penthouse. Featuring panoramic city views, designer interiors, and world-class amenities. This exclusive residence offers unparalleled sophistication with private elevator access, a wraparound terrace, and premium finishes throughout. For the most discerning residents.",
    amenities: ["City View", "Private Elevator", "Terrace", "Air Conditioning", "Concierge", "Gym Access", "Swimming Pool", "Wine Cellar"],
    isAvailable: true,
  },
  {
    id: "6",
    name: "Riverside Retreat",
    location: "Chiang Mai",
    address: "888 Ping River Road, Chiang Mai 50300",
    beds: 2,
    baths: 2,
    area: 1200,
    price: 18000,
    type: "House",
    image: "/images/rentals/rental2.jpg",
    images: ["/images/rentals/rental2.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental3.jpg", "/images/rentals/rental4.jpg"],
    description: "Discover tranquility at this charming riverside property. Wake up to the gentle sounds of the Ping River and enjoy your morning coffee on the private deck. This cozy home combines rustic charm with modern amenities, offering a perfect escape from city life while remaining conveniently located.",
    amenities: ["River View", "Private Deck", "Garden", "Air Conditioning", "Furnished", "Parking", "WiFi", "Kayak Access"],
    isAvailable: true,
  },
  {
    id: "7",
    name: "Beachfront Bungalow",
    location: "Pattaya Beach",
    address: "999 Jomtien Beach Road, Pattaya 20250",
    beds: 1,
    baths: 1,
    area: 600,
    price: 12000,
    type: "Villa",
    image: "/images/rentals/rental3.jpg",
    images: ["/images/rentals/rental3.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental4.jpg"],
    description: "Your own slice of paradise awaits in this cozy beachfront bungalow. Step directly onto the sand from your private terrace and enjoy stunning sunset views every evening. This intimate retreat is perfect for couples or solo travelers seeking a peaceful beach lifestyle with all essential comforts.",
    amenities: ["Beach Access", "Ocean View", "Terrace", "Air Conditioning", "Furnished", "WiFi", "Outdoor Shower", "Hammock"],
    isAvailable: true,
  },
  {
    id: "8",
    name: "Mountain View Estate",
    location: "Chiang Mai",
    address: "777 Doi Suthep Road, Chiang Mai 50200",
    beds: 5,
    baths: 4,
    area: 3500,
    price: 55000,
    type: "Villa",
    image: "/images/rentals/rental4.jpg",
    images: ["/images/rentals/rental4.jpg", "/images/rentals/rental1.jpg", "/images/rentals/rental2.jpg", "/images/rentals/rental3.jpg"],
    description: "Live among the clouds in this magnificent mountain estate. This grand property offers sweeping views of Doi Suthep and the surrounding valleys. With generous living spaces, a private infinity pool, and beautifully landscaped gardens, this estate provides an unmatched living experience for those who desire space and luxury.",
    amenities: ["Mountain View", "Infinity Pool", "Garden", "Air Conditioning", "Furnished", "Security", "Parking", "Home Office"],
    isAvailable: true,
  },
];

async function seed() {
  console.log("🌱 Seeding database...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await db.delete(rental);
  await db.delete(property);
  console.log("  ✓ Cleared rentals and properties\n");

  // Insert all properties
  console.log("📦 Inserting properties...");
  for (const prop of allProperties) {
    await db.insert(property).values(prop);
    console.log(`  ✓ ${prop.name}`);
  }

  // Get the first user to assign rentals to
  const users = await db.select().from(user).limit(1);

  if (users.length > 0) {
    const userId = users[0].id;
    console.log(`\n📝 Creating rentals for user: ${users[0].email}`);

    const sampleRentals = [
      {
        id: "rental-1",
        userId,
        propertyId: "3", // Modern City Condo
        startDate: new Date("2024-01-15"),
        endDate: new Date("2025-01-14"),
        monthlyRent: 15000,
        status: "active",
      },
      {
        id: "rental-2",
        userId,
        propertyId: "2", // Ocean View Villa
        startDate: new Date("2023-06-01"),
        endDate: new Date("2023-12-31"),
        monthlyRent: 45000,
        status: "completed",
      },
      {
        id: "rental-3",
        userId,
        propertyId: "1", // Serene Haven Estates
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-05-31"),
        monthlyRent: 25000,
        status: "active",
      },
    ];

    for (const r of sampleRentals) {
      await db.insert(rental).values(r);
      console.log(`  ✓ Rental for property ${r.propertyId} (${r.status})`);
    }
  } else {
    console.log("\n⚠️  No users found. Skipping rental creation.");
  }

  console.log("\n✅ Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });

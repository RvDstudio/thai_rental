import { pgTable, text, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Better Auth required tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date", withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date", withTimezone: true }),
  scope: text("scope"),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: true }),
  password: text("password"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow(),
});

// Property listings
export const property = pgTable("property", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameTh: text("nameTh"), // Thai translation of name
  location: text("location").notNull(),
  locationTh: text("locationTh"), // Thai translation of location
  address: text("address").notNull(),
  beds: integer("beds").notNull(),
  baths: integer("baths").notNull(),
  area: integer("area").notNull(),
  price: integer("price").notNull(), // Monthly price in THB
  type: text("type").notNull(), // 'House' | 'Villa' | 'Condo' | 'Apartment'
  image: text("image").notNull(),
  images: text("images").array(),
  description: text("description"),
  amenities: text("amenities").array(),
  isAvailable: boolean("isAvailable").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

// Rental agreements
export const rental = pgTable("rental", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  propertyId: text("propertyId")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  startDate: timestamp("startDate", { mode: "date", withTimezone: true }).notNull(),
  endDate: timestamp("endDate", { mode: "date", withTimezone: true }).notNull(),
  monthlyRent: integer("monthlyRent").notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'active' | 'completed' | 'cancelled'
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).notNull().defaultNow(),
});

// Export schema object for Better Auth
export const schema = {
  user,
  session,
  account,
  verification,
};

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  rentals: many(rental),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const propertyRelations = relations(property, ({ many }) => ({
  rentals: many(rental),
}));

export const rentalRelations = relations(rental, ({ one }) => ({
  user: one(user, {
    fields: [rental.userId],
    references: [user.id],
  }),
  property: one(property, {
    fields: [rental.propertyId],
    references: [property.id],
  }),
}));
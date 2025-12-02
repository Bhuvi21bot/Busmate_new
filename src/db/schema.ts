// Complete MySQL schema migration
import { mysqlTable, int, varchar, text, timestamp, decimal, boolean, index } from 'drizzle-orm/mysql-core';

// Auth tables for better-auth (MySQL format)
export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// OTP verification table
export const otpVerification = mysqlTable("otp_verification", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull(),
  otpCode: varchar("otp_code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
}));

// Drivers table (comprehensive)
export const drivers = mysqlTable("drivers", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 50 }).notNull(),
  vehicleNumber: varchar("vehicle_number", { length: 50 }).notNull().unique(),
  licenseNumber: varchar("license_number", { length: 100 }).notNull().unique(),
  licenseImage: text("license_image"),
  vehicleImage: text("vehicle_image"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRides: int("total_rides").notNull().default(0),
  verificationStatus: varchar("verification_status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

// Bookings table
export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  driverId: int("driver_id").references(() => drivers.id),
  pickupLocation: varchar("pickup_location", { length: 500 }).notNull(),
  dropLocation: varchar("drop_location", { length: 500 }).notNull(),
  pickupTime: timestamp("pickup_time").notNull(),
  fare: decimal("fare", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  seats: int("seats").notNull().default(1),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  paymentId: varchar("payment_id", { length: 255 }),
  orderId: varchar("order_id", { length: 255 }),
  confirmationCode: varchar("confirmation_code", { length: 50 }),
  vehicleType: varchar("vehicle_type", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  driverIdIdx: index("driver_id_idx").on(table.driverId),
  statusIdx: index("status_idx").on(table.status),
}));

// Vehicles table
export const vehicles = mysqlTable("vehicles", {
  id: int("id").primaryKey().autoincrement(),
  driverId: int("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  number: varchar("number", { length: 50 }).notNull().unique(),
  model: varchar("model", { length: 100 }).notNull(),
  capacity: int("capacity").notNull(),
  image: text("image"),
  status: varchar("status", { length: 20 }).notNull().default("available"),
  locationLat: decimal("location_lat", { precision: 10, scale: 7 }),
  locationLng: decimal("location_lng", { precision: 10, scale: 7 }),
  currentRoute: varchar("current_route", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  driverIdIdx: index("driver_id_idx").on(table.driverId),
  statusIdx: index("status_idx").on(table.status),
}));

// Wallet table
export const wallets = mysqlTable("wallets", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("user_id", { length: 255 }).notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0.00"),
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
}));

// Wallet transactions table
export const walletTransactions = mysqlTable("wallet_transactions", {
  id: int("id").primaryKey().autoincrement(),
  walletId: int("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 20 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  referenceId: varchar("reference_id", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  walletIdIdx: index("wallet_id_idx").on(table.walletId),
  userIdIdx: index("user_id_idx").on(table.userId),
}));

// Reviews table
export const reviews = mysqlTable("reviews", {
  id: int("id").primaryKey().autoincrement(),
  bookingId: int("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => user.id, { onDelete: "cascade" }),
  driverId: int("driver_id").references(() => drivers.id),
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  bookingIdIdx: index("booking_id_idx").on(table.bookingId),
  driverIdIdx: index("driver_id_idx").on(table.driverId),
}));
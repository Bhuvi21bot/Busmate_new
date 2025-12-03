// SQLite schema for Turso
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

// Auth tables for better-auth (SQLite format)
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: 'boolean' }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: 'timestamp' }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Drivers table
export const drivers = sqliteTable("drivers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  vehicleNumber: text("vehicle_number").notNull().unique(),
  licenseNumber: text("license_number").notNull().unique(),
  licenseImage: text("license_image"),
  vehicleImage: text("vehicle_image"),
  status: text("status").notNull().default("pending"),
  rating: real("rating").default(0),
  totalRides: integer("total_rides").notNull().default(0),
  verificationStatus: text("verification_status").notNull().default("pending"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  driverUserIdIdx: index("driver_user_id_idx").on(table.userId),
  driverStatusIdx: index("driver_status_idx").on(table.status),
}));

// Bookings table
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  driverId: integer("driver_id").references(() => drivers.id),
  pickupLocation: text("pickup_location").notNull(),
  dropLocation: text("drop_location").notNull(),
  pickupTime: integer("pickup_time", { mode: 'timestamp' }).notNull(),
  fare: real("fare").notNull(),
  status: text("status").notNull().default("pending"),
  seats: integer("seats").notNull().default(1),
  paymentStatus: text("payment_status").notNull().default("pending"),
  paymentId: text("payment_id"),
  orderId: text("order_id"),
  confirmationCode: text("confirmation_code"),
  vehicleType: text("vehicle_type"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  bookingUserIdIdx: index("booking_user_id_idx").on(table.userId),
  bookingDriverIdIdx: index("booking_driver_id_idx").on(table.driverId),
  bookingStatusIdx: index("booking_status_idx").on(table.status),
}));

// Vehicles table
export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  driverId: integer("driver_id").notNull().references(() => drivers.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  number: text("number").notNull().unique(),
  model: text("model").notNull(),
  capacity: integer("capacity").notNull(),
  image: text("image"),
  status: text("status").notNull().default("available"),
  locationLat: real("location_lat"),
  locationLng: real("location_lng"),
  currentRoute: text("current_route"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  vehicleDriverIdIdx: index("vehicle_driver_id_idx").on(table.driverId),
  vehicleStatusIdx: index("vehicle_status_idx").on(table.status),
}));

// Wallet table
export const wallets = sqliteTable("wallets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  balance: real("balance").notNull().default(0),
  currency: text("currency").notNull().default("INR"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  walletUserIdIdx: index("wallet_user_id_idx").on(table.userId),
}));

// Wallet transactions table
export const walletTransactions = sqliteTable("wallet_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  walletId: integer("wallet_id").notNull().references(() => wallets.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  amount: real("amount").notNull(),
  balanceAfter: real("balance_after").notNull(),
  description: text("description").notNull(),
  referenceId: text("reference_id"),
  status: text("status").notNull().default("completed"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  wtWalletIdIdx: index("wt_wallet_id_idx").on(table.walletId),
  wtUserIdIdx: index("wt_user_id_idx").on(table.userId),
}));

// Reviews table
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  driverId: integer("driver_id").references(() => drivers.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  reviewBookingIdIdx: index("review_booking_id_idx").on(table.bookingId),
  reviewDriverIdIdx: index("review_driver_id_idx").on(table.driverId),
}));
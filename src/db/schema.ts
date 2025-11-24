import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Add new tables for driver dashboard system
export const drivers = sqliteTable('drivers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  district: text('district').notNull(),
  license: text('license').notNull().unique(),
  vehicle: text('vehicle').notNull(),
  bloodGroup: text('blood_group').notNull(),
  email: text('email'),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  status: text('status').notNull().default('pending'),
  applicationNumber: text('application_number').notNull().unique(),
  appliedDate: text('applied_date').notNull(),
  approvedDate: text('approved_date'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const driverWallets = sqliteTable('driver_wallets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  driverId: integer('driver_id').notNull().references(() => drivers.id),
  totalEarnings: real('total_earnings').notNull().default(0),
  pendingPayouts: real('pending_payouts').notNull().default(0),
  lastPayoutAmount: real('last_payout_amount'),
  lastPayoutDate: text('last_payout_date'),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const driverRides = sqliteTable('driver_rides', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  driverId: integer('driver_id').notNull().references(() => drivers.id),
  rideNumber: text('ride_number').notNull().unique(),
  date: text('date').notNull(),
  route: text('route').notNull(),
  fare: real('fare').notNull(),
  passengerCount: integer('passenger_count').notNull().default(1),
  status: text('status').notNull().default('completed'),
  createdAt: text('created_at').notNull(),
});

// Add new wallet_transactions table
export const walletTransactions = sqliteTable('wallet_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  driverId: integer('driver_id').notNull().references(() => drivers.id),
  walletId: integer('wallet_id').notNull().references(() => driverWallets.id),
  type: text('type').notNull(),
  amount: real('amount').notNull(),
  balanceAfter: real('balance_after').notNull(),
  description: text('description').notNull(),
  referenceNumber: text('reference_number').unique(),
  rideId: integer('ride_id').references(() => driverRides.id),
  status: text('status').notNull().default('completed'),
  createdAt: text('created_at').notNull(),
});

// Add new driver_settings table
export const driverSettings = sqliteTable('driver_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  driverId: integer('driver_id').notNull().unique().references(() => drivers.id),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).default(true),
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true),
  smsNotifications: integer('sms_notifications', { mode: 'boolean' }).default(true),
  autoAcceptRides: integer('auto_accept_rides', { mode: 'boolean' }).default(false),
  availabilityStatus: text('availability_status').notNull().default('available'),
  preferredRoutes: text('preferred_routes', { mode: 'json' }),
  language: text('language').notNull().default('en'),
  theme: text('theme').notNull().default('light'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Modify driver_reviews table to remove foreign key constraint on customer_id
export const driverReviews = sqliteTable('driver_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  driverId: integer('driver_id').notNull().references(() => drivers.id),
  customerId: text('customer_id').notNull(),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  rideId: integer('ride_id').references(() => driverRides.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});
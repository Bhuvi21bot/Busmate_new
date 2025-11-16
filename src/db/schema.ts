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
CREATE TABLE `driver_rides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` integer NOT NULL,
	`ride_number` text NOT NULL,
	`date` text NOT NULL,
	`route` text NOT NULL,
	`fare` real NOT NULL,
	`passenger_count` integer DEFAULT 1 NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `driver_rides_ride_number_unique` ON `driver_rides` (`ride_number`);--> statement-breakpoint
CREATE TABLE `driver_wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` integer NOT NULL,
	`total_earnings` real DEFAULT 0 NOT NULL,
	`pending_payouts` real DEFAULT 0 NOT NULL,
	`last_payout_amount` real,
	`last_payout_date` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `drivers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`license` text NOT NULL,
	`vehicle` text NOT NULL,
	`blood_group` text NOT NULL,
	`email` text,
	`file_name` text NOT NULL,
	`file_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`application_number` text NOT NULL,
	`applied_date` text NOT NULL,
	`approved_date` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_license_unique` ON `drivers` (`license`);--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_application_number_unique` ON `drivers` (`application_number`);
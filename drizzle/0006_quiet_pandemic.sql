CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`pickup` text NOT NULL,
	`dropoff` text NOT NULL,
	`vehicle_type` text NOT NULL,
	`datetime` text NOT NULL,
	`passengers` integer NOT NULL,
	`seats` text NOT NULL,
	`fare` real NOT NULL,
	`payment_id` text,
	`order_id` text,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`payment_status` text DEFAULT 'paid' NOT NULL,
	`confirmation_code` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `drivers_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`license_number` text NOT NULL,
	`phone` text NOT NULL,
	`experience_years` integer NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`total_trips` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_new_user_id_unique` ON `drivers_new` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `drivers_new_license_number_unique` ON `drivers_new` (`license_number`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`driver_id` integer,
	`booking_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers_new`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_number` text NOT NULL,
	`vehicle_type` text NOT NULL,
	`capacity` integer NOT NULL,
	`driver_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`current_route` text,
	`location_lat` real,
	`location_lng` real,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vehicles_vehicle_number_unique` ON `vehicles` (`vehicle_number`);--> statement-breakpoint
CREATE TABLE `wallet_transactions_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`balance_after` real NOT NULL,
	`description` text NOT NULL,
	`reference_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);

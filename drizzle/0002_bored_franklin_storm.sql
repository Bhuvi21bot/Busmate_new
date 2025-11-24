CREATE TABLE `driver_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` integer NOT NULL,
	`notifications_enabled` integer DEFAULT true,
	`email_notifications` integer DEFAULT true,
	`sms_notifications` integer DEFAULT true,
	`auto_accept_rides` integer DEFAULT false,
	`availability_status` text DEFAULT 'available' NOT NULL,
	`preferred_routes` text,
	`language` text DEFAULT 'en' NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `driver_settings_driver_id_unique` ON `driver_settings` (`driver_id`);--> statement-breakpoint
CREATE TABLE `wallet_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` integer NOT NULL,
	`wallet_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`balance_after` real NOT NULL,
	`description` text NOT NULL,
	`reference_number` text,
	`ride_id` integer,
	`status` text DEFAULT 'completed' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`wallet_id`) REFERENCES `driver_wallets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ride_id`) REFERENCES `driver_rides`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wallet_transactions_reference_number_unique` ON `wallet_transactions` (`reference_number`);
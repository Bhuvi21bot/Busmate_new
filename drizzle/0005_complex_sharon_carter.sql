CREATE TABLE `customer_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`phone` text,
	`address` text,
	`city` text,
	`state` text,
	`pincode` text,
	`emergency_contact` text,
	`emergency_contact_name` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_profiles_user_id_unique` ON `customer_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `customer_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`notifications_enabled` integer DEFAULT true NOT NULL,
	`email_notifications` integer DEFAULT true NOT NULL,
	`sms_notifications` integer DEFAULT true NOT NULL,
	`ride_reminders` integer DEFAULT true NOT NULL,
	`promotional_emails` integer DEFAULT false NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`theme` text DEFAULT 'light' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_settings_user_id_unique` ON `customer_settings` (`user_id`);--> statement-breakpoint
CREATE TABLE `customer_wallet_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`wallet_id` integer NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`balance_before` real NOT NULL,
	`balance_after` real NOT NULL,
	`description` text NOT NULL,
	`reference_number` text NOT NULL,
	`booking_id` integer,
	`payment_method` text,
	`status` text DEFAULT 'completed' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`wallet_id`) REFERENCES `customer_wallets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_wallet_transactions_reference_number_unique` ON `customer_wallet_transactions` (`reference_number`);--> statement-breakpoint
CREATE TABLE `customer_wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`total_spent` real DEFAULT 0 NOT NULL,
	`total_added` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_wallets_user_id_unique` ON `customer_wallets` (`user_id`);
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_driver_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`driver_id` integer NOT NULL,
	`customer_id` text NOT NULL,
	`customer_name` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`ride_id` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `drivers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ride_id`) REFERENCES `driver_rides`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_driver_reviews`("id", "driver_id", "customer_id", "customer_name", "rating", "comment", "ride_id", "created_at", "updated_at") SELECT "id", "driver_id", "customer_id", "customer_name", "rating", "comment", "ride_id", "created_at", "updated_at" FROM `driver_reviews`;--> statement-breakpoint
DROP TABLE `driver_reviews`;--> statement-breakpoint
ALTER TABLE `__new_driver_reviews` RENAME TO `driver_reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
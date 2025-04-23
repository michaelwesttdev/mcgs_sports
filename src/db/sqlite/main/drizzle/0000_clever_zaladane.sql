CREATE TABLE `discipline` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discipline_name_unique` ON `discipline` (`name`);--> statement-breakpoint
CREATE INDEX `discipline_name_idx` ON `discipline` (`name`);--> statement-breakpoint
CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text,
	`discipline_id` text NOT NULL,
	`type` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`discipline_id`) REFERENCES `discipline`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`location` text(255) NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);

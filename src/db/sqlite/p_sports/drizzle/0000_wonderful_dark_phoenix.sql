CREATE TABLE `event` (
	`id` text PRIMARY KEY NOT NULL,
	`event_number` integer DEFAULT 0,
	`title` text(255) NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`record_holder` text,
	`recording_metric` text,
	`record` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `house` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `participant` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`age` integer NOT NULL,
	`gender` text NOT NULL,
	`house_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`house_id`) REFERENCES `house`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `participant_name_idx` ON `participant` (`first_name`,`last_name`);--> statement-breakpoint
CREATE INDEX `participant_house_idx` ON `participant` (`house_id`);
ALTER TABLE `event` RENAME COLUMN "recording_metric" TO "measurement_metric";--> statement-breakpoint
ALTER TABLE `event` ADD `age_group` integer;--> statement-breakpoint
ALTER TABLE `event` ADD `gender` text NOT NULL;--> statement-breakpoint
ALTER TABLE `event` ADD `is_record_broken` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_participant` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`age` text NOT NULL,
	`gender` text NOT NULL,
	`house_id` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`house_id`) REFERENCES `house`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_participant`("id", "first_name", "last_name", "age", "gender", "house_id", "created_at", "updated_at", "deleted_at") SELECT "id", "first_name", "last_name", "age", "gender", "house_id", "created_at", "updated_at", "deleted_at" FROM `participant`;--> statement-breakpoint
DROP TABLE `participant`;--> statement-breakpoint
ALTER TABLE `__new_participant` RENAME TO `participant`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `participant_name_idx` ON `participant` (`first_name`,`last_name`);--> statement-breakpoint
CREATE INDEX `participant_house_idx` ON `participant` (`house_id`);
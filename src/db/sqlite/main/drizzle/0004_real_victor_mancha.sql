PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_event` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(255) NOT NULL,
	`description` text,
	`discipline_id` text NOT NULL,
	`type` text NOT NULL,
	`measurement_nature` text,
	`measurement_metric` text,
	`age_group` text NOT NULL,
	`gender` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`discipline_id`) REFERENCES `discipline`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_event`("id", "title", "description", "discipline_id", "type", "measurement_nature", "measurement_metric", "age_group", "gender", "created_at", "updated_at", "deleted_at") SELECT "id", "title", "description", "discipline_id", "type", "measurement_nature", "measurement_metric", "age_group", "gender", "created_at", "updated_at", "deleted_at" FROM `event`;--> statement-breakpoint
DROP TABLE `event`;--> statement-breakpoint
ALTER TABLE `__new_event` RENAME TO `event`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
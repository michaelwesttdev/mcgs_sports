PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_event` (
	`id` text PRIMARY KEY NOT NULL,
	`event_number` integer DEFAULT 0,
	`title` text(255) NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`measurement_nature` text,
	`measurement_metric` text,
	`age_group` text NOT NULL,
	`gender` text NOT NULL,
	`record_holder` text,
	`record` text,
	`best_score` text,
	`status` text,
	`is_record_broken` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_event`("id", "event_number", "title", "description", "type", "measurement_nature", "measurement_metric", "age_group", "gender", "record_holder", "record", "best_score", "status", "is_record_broken", "created_at", "updated_at", "deleted_at") SELECT "id", "event_number", "title", "description", "type", "measurement_nature", "measurement_metric", "age_group", "gender", "record_holder", "record", "best_score", "status", "is_record_broken", "created_at", "updated_at", "deleted_at" FROM `event`;--> statement-breakpoint
DROP TABLE `event`;--> statement-breakpoint
ALTER TABLE `__new_event` RENAME TO `event`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
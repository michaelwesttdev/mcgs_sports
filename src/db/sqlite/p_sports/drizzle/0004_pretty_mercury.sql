CREATE TABLE `event_result` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text,
	`participant_id` text,
	`participant_type` text,
	`position` integer NOT NULL,
	`measurement` text,
	`points` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON UPDATE no action ON DELETE cascade
);

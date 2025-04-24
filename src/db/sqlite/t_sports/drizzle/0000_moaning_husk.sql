CREATE TABLE `player` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`team_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `player_team_idx` ON `player` (`team_id`);--> statement-breakpoint
CREATE TABLE `player_event_stats` (
	`player_id` text NOT NULL,
	`event_id` text NOT NULL,
	`goals` integer DEFAULT 0,
	`assists` integer DEFAULT 0,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`player_id`, `event_id`)
);
--> statement-breakpoint
CREATE INDEX `player_event_stats_event_idx` ON `player_event_stats` (`event_id`);--> statement-breakpoint
CREATE TABLE `team` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE INDEX `team_name_idx` ON `team` (`name`);--> statement-breakpoint
CREATE TABLE `team_event` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`category` text(100),
	`gender` text(10),
	`round` text(100),
	`date` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `team_event_participation` (
	`event_id` text NOT NULL,
	`team_id` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`position` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`deleted_at` text,
	PRIMARY KEY(`event_id`, `team_id`)
);
--> statement-breakpoint
CREATE INDEX `team_event_participation_event_idx` ON `team_event_participation` (`event_id`);--> statement-breakpoint
CREATE INDEX `team_event_participation_team_idx` ON `team_event_participation` (`team_id`);
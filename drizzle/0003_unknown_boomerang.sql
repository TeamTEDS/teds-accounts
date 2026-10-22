CREATE TABLE `teds_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`domain` text GENERATED ALWAYS AS (lower(substr(email, instr(email, '@') + 1))) VIRTUAL NOT NULL,
	`type` text DEFAULT 'main' NOT NULL,
	`request` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`request`) REFERENCES `email_requests`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "teds_emails_domain_check" CHECK("teds_emails"."domain" IN ('teds.one', 'teds.top', 'nxui.link'))
);
--> statement-breakpoint
CREATE INDEX `teds_emails_user_id_idx` ON `teds_emails` (`user_id`);--> statement-breakpoint
CREATE INDEX `teds_emails_request_idx` ON `teds_emails` (`request`);
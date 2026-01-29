CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`username` varchar(35) NOT NULL,
	`email` varchar(125),
	`phone` varchar(25),
	`password` varchar(255) NOT NULL,
	`role_id` int NOT NULL,
	`is_active` boolean DEFAULT false,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`created_by` int,
	`modified_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`modified_by` int,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(35) NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`created_by` int,
	`modified_at` datetime DEFAULT CURRENT_TIMESTAMP,
	`modified_by` int,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`user_agent` varchar(255),
	`ip_address` varchar(25),
	`location` varchar(255),
	`refresh_token` text NOT NULL,
	`expired_at` datetime NOT NULL,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_devices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_devices` ADD CONSTRAINT `user_devices_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;
CREATE TABLE "users" (
	"id" text PRIMARY KEY DEFAULT '0730cd39-c494-4aab-be9f-f043c1c345c1' NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255),
	"provider_login" boolean DEFAULT false,
	CONSTRAINT "users_name_unique" UNIQUE("name")
);

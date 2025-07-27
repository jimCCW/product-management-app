[dotenv@17.2.1] injecting env (9) from .env -- tip: 📡 observe env with Radar: https://dotenvx.com/radar
set names 'utf8';

create table "product" ("id" uuid not null, "name" varchar(255) not null, "description" text not null, "image_url" varchar(255) null, "price" int not null, "stock" int not null, "created_at" timestamptz null, "updated_at" timestamptz null, constraint "product_pkey" primary key ("id"));

create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" varchar(255) not null default 'user', "created_at" timestamptz null, "updated_at" timestamptz null, constraint "user_pkey" primary key ("id"));
alter table "user" add constraint "user_email_unique" unique ("email");

create table "order" ("id" uuid not null, "user_id" uuid not null, "created_at" timestamptz null, constraint "order_pkey" primary key ("id"));

create table "order_item" ("id" uuid not null, "order_id" uuid not null, "product_id" varchar(255) not null, "product_name" varchar(255) not null, "price" int not null, "quantity" int not null, constraint "order_item_pkey" primary key ("id"));

create table "cart_item" ("id" uuid not null, "user_id" uuid not null, "product_id" uuid not null, "quantity" int not null, "created_at" timestamptz null, "updated_at" timestamptz null, constraint "cart_item_pkey" primary key ("id"));

alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;

alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;

alter table "cart_item" add constraint "cart_item_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;
alter table "cart_item" add constraint "cart_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;


[32m[39m

import { Migration } from '@mikro-orm/migrations';

export class Migration20250725152944 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "product" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) not null, "price" int not null, "stock" int not null, "image_url" varchar(255) null, constraint "product_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" varchar(255) not null default 'user', constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}

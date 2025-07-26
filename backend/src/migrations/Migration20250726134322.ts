import { Migration } from '@mikro-orm/migrations';

export class Migration20250726134322 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "order" ("id" uuid not null, "created_at" timestamptz not null, "user_id" uuid not null, constraint "order_pkey" primary key ("id"));`);

    this.addSql(`create table "order_item" ("id" uuid not null, "order_id" uuid not null, "product_id" varchar(255) not null, "product_name" varchar(255) not null, "price" int not null, "quantity" int not null, constraint "order_item_pkey" primary key ("id"));`);

    this.addSql(`alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`drop table if exists "order" cascade;`);

    this.addSql(`drop table if exists "order_item" cascade;`);
  }

}

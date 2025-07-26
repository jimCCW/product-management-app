import { Migration } from '@mikro-orm/migrations';

export class Migration20250726074543 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "cart_item" ("id" uuid not null, "user_id" uuid not null, "product_id" uuid not null, "quantity" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cart_item_pkey" primary key ("id"));`);

    this.addSql(`alter table "cart_item" add constraint "cart_item_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cart_item" add constraint "cart_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "cart_item" cascade;`);
  }

}

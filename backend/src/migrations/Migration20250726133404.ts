import { Migration } from '@mikro-orm/migrations';

export class Migration20250726133404 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cart_item" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "cart_item" alter column "created_at" drop not null;`);
    this.addSql(`alter table "cart_item" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "cart_item" alter column "updated_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cart_item" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "cart_item" alter column "created_at" set not null;`);
    this.addSql(`alter table "cart_item" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "cart_item" alter column "updated_at" set not null;`);
  }

}

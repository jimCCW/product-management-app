import { Migration } from '@mikro-orm/migrations';

export class Migration20250726134505 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "order" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "order" alter column "created_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "order" alter column "created_at" set not null;`);
  }

}

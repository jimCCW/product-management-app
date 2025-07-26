import { Migration } from '@mikro-orm/migrations';

export class Migration20250726034012 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user" alter column "created_at" drop not null;`);
    this.addSql(`alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "user" alter column "updated_at" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user" alter column "created_at" set not null;`);
    this.addSql(`alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "user" alter column "updated_at" set not null;`);
  }

}

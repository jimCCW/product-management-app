import { Migration } from '@mikro-orm/migrations';

export class Migration20250726033130 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "product" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);

    this.addSql(`alter table "user" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "product" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "user" drop column "created_at", drop column "updated_at";`);
  }

}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logo_light_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "site_icon_id" integer;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_logo_id_media_id_fk') THEN
        ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_logo_light_id_media_id_fk') THEN
        ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_site_icon_id_media_id_fk') THEN
        ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_site_icon_id_media_id_fk" FOREIGN KEY ("site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
    CREATE INDEX IF NOT EXISTS "site_settings_logo_light_idx" ON "site_settings" USING btree ("logo_light_id");
    CREATE INDEX IF NOT EXISTS "site_settings_site_icon_idx" ON "site_settings" USING btree ("site_icon_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_logo_id_media_id_fk";
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_logo_light_id_media_id_fk";
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_site_icon_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_logo_idx";
    DROP INDEX IF EXISTS "site_settings_logo_light_idx";
    DROP INDEX IF EXISTS "site_settings_site_icon_idx";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "logo_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "logo_light_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "site_icon_id";
  `)
}

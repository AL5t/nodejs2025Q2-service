import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1765187192145 implements MigrationInterface {
    name = 'InitSchema1765187192145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "duration" integer NOT NULL, "artistId" uuid, "albumId" uuid, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "artists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "albums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favorites_artists" ("user_id" uuid NOT NULL, "artist_id" uuid NOT NULL, CONSTRAINT "PK_e5f4d6a6a2a02795d4a057be94f" PRIMARY KEY ("user_id", "artist_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_879f6ed7b2ce7ccb22642d14ca" ON "favorites_artists" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8bfb6dd796755ef300ab5a71b2" ON "favorites_artists" ("artist_id") `);
        await queryRunner.query(`CREATE TABLE "favorites_albums" ("user_id" uuid NOT NULL, "album_id" uuid NOT NULL, CONSTRAINT "PK_5f9cf1d28a0db4ce7858f96f11f" PRIMARY KEY ("user_id", "album_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b92c4cf190dbd2d5c45baadfb3" ON "favorites_albums" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f17950531ea5f11fae13c7bbbd" ON "favorites_albums" ("album_id") `);
        await queryRunner.query(`CREATE TABLE "favorites_tracks" ("user_id" uuid NOT NULL, "track_id" uuid NOT NULL, CONSTRAINT "PK_f603ec33afdcc5768a7caff4447" PRIMARY KEY ("user_id", "track_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_30eb976e51de367b3a6492d8bb" ON "favorites_tracks" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4b8a7703eafd7a5041fb494838" ON "favorites_tracks" ("track_id") `);
        await queryRunner.query(`CREATE TABLE "favorites_artists_artists" ("favoritesId" uuid NOT NULL, "artistsId" uuid NOT NULL, CONSTRAINT "PK_66223ae7b354407f1992d1569e5" PRIMARY KEY ("favoritesId", "artistsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_80db6cf8e0b60a21a82563d6b4" ON "favorites_artists_artists" ("favoritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_660eecabb197df0e6b0835554f" ON "favorites_artists_artists" ("artistsId") `);
        await queryRunner.query(`CREATE TABLE "favorites_albums_albums" ("favoritesId" uuid NOT NULL, "albumsId" uuid NOT NULL, CONSTRAINT "PK_64a7bf3ac232299b01062463fc0" PRIMARY KEY ("favoritesId", "albumsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_caee2f2437cd634201109549c2" ON "favorites_albums_albums" ("favoritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4f68d4e307c3df157487b5f5c9" ON "favorites_albums_albums" ("albumsId") `);
        await queryRunner.query(`CREATE TABLE "favorites_tracks_tracks" ("favoritesId" uuid NOT NULL, "tracksId" uuid NOT NULL, CONSTRAINT "PK_e1d7ed5b143827263347ad6c43a" PRIMARY KEY ("favoritesId", "tracksId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cdb702f7ae63243bc8ffda8e0a" ON "favorites_tracks_tracks" ("favoritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a68f39bdfc7688558ab5a2f389" ON "favorites_tracks_tracks" ("tracksId") `);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_62f595181306916265849fced48" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_5c52e761792791f57de2fec342d" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "albums" ADD CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites_artists" ADD CONSTRAINT "FK_879f6ed7b2ce7ccb22642d14ca0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_artists" ADD CONSTRAINT "FK_8bfb6dd796755ef300ab5a71b27" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_albums" ADD CONSTRAINT "FK_b92c4cf190dbd2d5c45baadfb3a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_albums" ADD CONSTRAINT "FK_f17950531ea5f11fae13c7bbbde" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks" ADD CONSTRAINT "FK_30eb976e51de367b3a6492d8bbd" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks" ADD CONSTRAINT "FK_4b8a7703eafd7a5041fb494838c" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_artists_artists" ADD CONSTRAINT "FK_80db6cf8e0b60a21a82563d6b48" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_artists_artists" ADD CONSTRAINT "FK_660eecabb197df0e6b0835554f6" FOREIGN KEY ("artistsId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_albums_albums" ADD CONSTRAINT "FK_caee2f2437cd634201109549c20" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_albums_albums" ADD CONSTRAINT "FK_4f68d4e307c3df157487b5f5c94" FOREIGN KEY ("albumsId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks_tracks" ADD CONSTRAINT "FK_cdb702f7ae63243bc8ffda8e0aa" FOREIGN KEY ("favoritesId") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks_tracks" ADD CONSTRAINT "FK_a68f39bdfc7688558ab5a2f3892" FOREIGN KEY ("tracksId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorites_tracks_tracks" DROP CONSTRAINT "FK_a68f39bdfc7688558ab5a2f3892"`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks_tracks" DROP CONSTRAINT "FK_cdb702f7ae63243bc8ffda8e0aa"`);
        await queryRunner.query(`ALTER TABLE "favorites_albums_albums" DROP CONSTRAINT "FK_4f68d4e307c3df157487b5f5c94"`);
        await queryRunner.query(`ALTER TABLE "favorites_albums_albums" DROP CONSTRAINT "FK_caee2f2437cd634201109549c20"`);
        await queryRunner.query(`ALTER TABLE "favorites_artists_artists" DROP CONSTRAINT "FK_660eecabb197df0e6b0835554f6"`);
        await queryRunner.query(`ALTER TABLE "favorites_artists_artists" DROP CONSTRAINT "FK_80db6cf8e0b60a21a82563d6b48"`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks" DROP CONSTRAINT "FK_4b8a7703eafd7a5041fb494838c"`);
        await queryRunner.query(`ALTER TABLE "favorites_tracks" DROP CONSTRAINT "FK_30eb976e51de367b3a6492d8bbd"`);
        await queryRunner.query(`ALTER TABLE "favorites_albums" DROP CONSTRAINT "FK_f17950531ea5f11fae13c7bbbde"`);
        await queryRunner.query(`ALTER TABLE "favorites_albums" DROP CONSTRAINT "FK_b92c4cf190dbd2d5c45baadfb3a"`);
        await queryRunner.query(`ALTER TABLE "favorites_artists" DROP CONSTRAINT "FK_8bfb6dd796755ef300ab5a71b27"`);
        await queryRunner.query(`ALTER TABLE "favorites_artists" DROP CONSTRAINT "FK_879f6ed7b2ce7ccb22642d14ca0"`);
        await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_ed378d7c337efd4d5c8396a77a1"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_5c52e761792791f57de2fec342d"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_62f595181306916265849fced48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a68f39bdfc7688558ab5a2f389"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdb702f7ae63243bc8ffda8e0a"`);
        await queryRunner.query(`DROP TABLE "favorites_tracks_tracks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f68d4e307c3df157487b5f5c9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_caee2f2437cd634201109549c2"`);
        await queryRunner.query(`DROP TABLE "favorites_albums_albums"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_660eecabb197df0e6b0835554f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80db6cf8e0b60a21a82563d6b4"`);
        await queryRunner.query(`DROP TABLE "favorites_artists_artists"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b8a7703eafd7a5041fb494838"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30eb976e51de367b3a6492d8bb"`);
        await queryRunner.query(`DROP TABLE "favorites_tracks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f17950531ea5f11fae13c7bbbd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b92c4cf190dbd2d5c45baadfb3"`);
        await queryRunner.query(`DROP TABLE "favorites_albums"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8bfb6dd796755ef300ab5a71b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_879f6ed7b2ce7ccb22642d14ca"`);
        await queryRunner.query(`DROP TABLE "favorites_artists"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "albums"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
    }

}

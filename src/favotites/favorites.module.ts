import { Module } from "@nestjs/common";
import { FavoritesController } from "./favorites.controller";
import { FavoritesService } from "./favorites.service";
import { ArtistsModule } from "src/artists/artists.module";
import { AlbumsModule } from "src/albums/albums.module";
import { TracksModule } from "src/tracks/tracks.module";

@Module({
  imports: [ArtistsModule, AlbumsModule, TracksModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [],
})

export class FavoritesModule {}
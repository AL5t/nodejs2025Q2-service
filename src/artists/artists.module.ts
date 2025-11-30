import { Module } from "@nestjs/common";
import { ArtistController } from "./artists.controller";
import { ArtistService } from "./artists.service";
import { AlbumsModule } from "src/albums/albums.module";
import { TracksModule } from "src/tracks/tracks.module";

@Module({
  imports: [AlbumsModule, TracksModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService]
})

export class ArtistsModule {}
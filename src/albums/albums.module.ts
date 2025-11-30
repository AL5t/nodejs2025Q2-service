import { Module } from "@nestjs/common";
import { AlbumController } from "./albums.controller";
import { AlbumService } from "./albums.service";

@Module({
  imports: [],
  controllers: [AlbumController],
  providers: [AlbumService],
})

export class AlbumsModule {}
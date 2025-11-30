import { Module } from '@nestjs/common';
import { AlbumController } from './albums.controller';
import { AlbumService } from './albums.service';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [TracksModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumsModule {}

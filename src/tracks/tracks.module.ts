import { forwardRef, Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TrackController } from './tracks.controller';
import { Track } from './track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumsModule } from 'src/albums/albums.module';
import { Artist } from 'src/artists/artists.entity';
import { Album } from 'src/albums/albums.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Artist, Album]),
    forwardRef(() => AlbumsModule),
  ],
  controllers: [TrackController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}

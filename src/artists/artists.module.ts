import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artists.controller';
import { ArtistService } from './artists.service';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist]),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistsModule {}

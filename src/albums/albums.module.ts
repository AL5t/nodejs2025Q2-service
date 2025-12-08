import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './albums.controller';
import { AlbumService } from './albums.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './albums.entity';
import { Artist } from 'src/artists/artists.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, Artist]),
    forwardRef(() => TracksModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumsModule {}

import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorites } from './favorites.entity';
import { Artist } from 'src/artists/artists.entity';
import { Album } from 'src/albums/albums.entity';
import { Track } from 'src/tracks/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites, Artist, Album, Track])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [],
})
export class FavoritesModule {}

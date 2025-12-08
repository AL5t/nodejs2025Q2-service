import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('/track/:id')
  @HttpCode(201)
  addTrackToFavorites(@Param('id') id: string) {
    return this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  deleteTrackFromFavorites(@Param('id') id: string) {
    return this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Post('/album/:id')
  @HttpCode(201)
  addAlbumToFavorites(@Param('id') id: string) {
    return this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  deleteAlbumFromFavorites(@Param('id') id: string) {
    return this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Post('/artist/:id')
  @HttpCode(201)
  addArtistToFavorites(@Param('id') id: string) {
    return this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  deleteArtistFromFavorites(@Param('id') id: string) {
    return this.favoritesService.deleteArtistFromFavorites(id);
  }
}

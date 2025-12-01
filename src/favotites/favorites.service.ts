import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './favoritesInterface';
import { ArtistService } from 'src/artists/artists.service';
import { AlbumService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TracksService,
  ) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id (not UUID)');
    }
  }

  getAllFavorites() {
    return {
      artists: this.favorites.artists
        ?.map((id) => {
          try {
            return this.artistService.getArtistById(id);
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean),
      albums: this.favorites.albums
        ?.map((id) => {
          try {
            return this.albumService.getAlbumById(id);
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean),
      tracks: this.favorites.tracks
        ?.map((id) => {
          try {
            return this.trackService.getTrackById(id);
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean),
    };
  }

  addTrackToFavorites(id: string) {
    this.validateUUID(id);

    let foundTrack;
    try {
      foundTrack = this.trackService.getTrackById(id);
    } catch (error) {
      throw new UnprocessableEntityException('Track not found');
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }

    return foundTrack;
  }

  deleteTrackFromFavorites(id: string) {
    this.validateUUID(id);

    if (!this.favorites.tracks.includes(id)) {
      throw new NotFoundException('Not found track in favorites');
    }

    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  addAlbumToFavorites(id: string) {
    this.validateUUID(id);

    let foundAlbum;
    try {
      foundAlbum = this.albumService.getAlbumById(id);
    } catch (error) {
      throw new UnprocessableEntityException('Album not found');
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }

    return foundAlbum;
  }

  deleteAlbumFromFavorites(id: string) {
    this.validateUUID(id);

    if (!this.favorites.albums.includes(id)) {
      throw new NotFoundException('Not found album in favorites');
    }

    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  addArtistToFavorites(id: string) {
    this.validateUUID(id);

    let foundArtist;
    try {
      foundArtist = this.artistService.getArtistById(id);
    } catch (error) {
      throw new UnprocessableEntityException('Artist not found');
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }

    return foundArtist;
  }

  deleteArtistFromFavorites(id: string) {
    this.validateUUID(id);

    if (!this.favorites.artists.includes(id)) {
      throw new NotFoundException('Not found artist in favorites');
    }

    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/artists/artists.entity';
import { Repository } from 'typeorm';
import { Album } from 'src/albums/albums.entity';
import { Track } from 'src/tracks/track.entity';
import { Favorites } from './favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favRepo: Repository<Favorites>,
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
  ) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid id (not UUID)');
    }
  }

  async getAllFavorites(): Promise<Favorites> {
    let favs = await this.favRepo.findOne({
      where: {},
      relations: ['artists', 'albums', 'tracks'],
    });
    if(!favs) {
      favs = this.favRepo.create({
        artists: [],
        albums: [],
        tracks: []
      });
      await this.favRepo.save(favs);

      favs = await this.favRepo.findOne({
        where: {},
        relations: ['artists', 'albums', 'tracks'],
      });
    }
    return favs!;
  }

  async addTrackToFavorites(id: string) {
    this.validateUUID(id);

    let foundTrack;
    try {
      foundTrack = await this.trackRepo.findOneBy({ id });
      if (!foundTrack) {
        throw new UnprocessableEntityException('Track not found');
      }
    } catch (error) {
      throw new UnprocessableEntityException('Track not found');
    }

    const favs = await this.getAllFavorites();
    favs.tracks.push(foundTrack);
    await this.favRepo.save(favs);
  }

  async deleteTrackFromFavorites(id: string) {
    this.validateUUID(id);

    const favs = await this.getAllFavorites();
    const prevLength = favs.tracks.length;

    favs.tracks = favs.tracks.filter((t) => t.id !== id);

    if (favs.tracks.length === prevLength) {
      throw new NotFoundException('Not found track in favorites');
    }

    await this.favRepo.save(favs);
  }

  async addAlbumToFavorites(id: string) {
    this.validateUUID(id);

    let foundAlbum;
    try {
      foundAlbum = await this.albumRepo.findOneBy({ id });
      if (!foundAlbum) {
        throw new UnprocessableEntityException('Album not found');
      }
    } catch (error) {
      throw new UnprocessableEntityException('Album not found');
    }

    const favs = await this.getAllFavorites();
    favs.albums.push(foundAlbum);
    await this.favRepo.save(favs);
  }

  async deleteAlbumFromFavorites(id: string) {
    this.validateUUID(id);

    const favs = await this.getAllFavorites();
    const prevLength = favs.albums.length;

    favs.albums = favs.albums.filter((alb) => alb.id !== id);

    if (favs.albums.length === prevLength) {
      throw new NotFoundException('Not found album in favorites');
    }

    await this.favRepo.save(favs);
  }

  async addArtistToFavorites(id: string) {
    this.validateUUID(id);

    let foundArtist;
    try {
      foundArtist = await this.artistRepo.findOneBy({ id });
      if (!foundArtist) {
        throw new UnprocessableEntityException('Artist not found');
      }
    } catch (error) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const favs = await this.getAllFavorites();
    favs.artists.push(foundArtist);
    await this.favRepo.save(favs);
  }

  async deleteArtistFromFavorites(id: string) {
    this.validateUUID(id);

    const favs = await this.getAllFavorites();
    const prevLength = favs.artists.length;

    favs.artists = favs.artists.filter((art) => art.id !== id);

    if (favs.artists.length === prevLength) {
      throw new NotFoundException('Not found artist in favorites');
    }

    await this.favRepo.save(favs);
  }
}

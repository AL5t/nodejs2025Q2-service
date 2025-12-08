import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { CreateTrackDto, UpdateTrackDto } from './dto/tracks.dto';
import { validate } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/artists.entity';
import { Album } from 'src/albums/albums.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepo: Repository<Track>,
    @InjectRepository(Artist)
    private readonly artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepo: Repository<Album>,
  ) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid track id (not UUID)');
    }
  }

  getAllTracks() {
    return this.trackRepo.find({ relations: ['artist', 'album'] });
  }

  async getTrackById(id: string) {
    this.validateUUID(id);

    const foundTrack = await this.trackRepo.findOneBy({ id });

    if (!foundTrack) {
      throw new NotFoundException('Track not found');
    }
    return foundTrack;
  }

  async createTrack(dto: CreateTrackDto) {
    if (
      !dto.name ||
      typeof dto.name !== 'string' ||
      !dto.duration ||
      typeof dto.duration !== 'number'
    ) {
      throw new BadRequestException('Required name or duration missing');
    }

    const artist = dto.artistId
      ? await this.artistRepo.findOneBy({ id: dto.artistId })
      : null;

    const album = dto.albumId
      ? await this.albumRepo.findOneBy({ id: dto.albumId })
      : null;

    return this.trackRepo.save({
      ...dto,
      artist,
      album,
    });
  }

  async updateTrack(id: string, dto: UpdateTrackDto) {
    this.validateUUID(id);

    const foundTrack = await this.trackRepo.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });

    if (!foundTrack) {
      throw new NotFoundException('Track not found');
    }

    if (dto.name !== undefined) {
      foundTrack.name = dto.name;
    }

    if (dto.duration !== undefined) {
      foundTrack.duration = dto.duration;
    }

    if (dto.artistId !== undefined) {
      foundTrack.artist = dto.artistId
        ? await this.artistRepo.findOneBy({ id: dto.artistId })
        : null;
    }

    if (dto.albumId !== undefined) {
      foundTrack.album = dto.albumId
        ? await this.albumRepo.findOneBy({ id: dto.albumId })
        : null;
    }

    return this.trackRepo.save(foundTrack);
  }

  async deleteTrack(id: string) {
    this.validateUUID(id);

    const foundTrack = await this.trackRepo.delete(id);

    if (foundTrack.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }

  async deleteArtistFromTracks(artistId: string) {
    await this.trackRepo
      .createQueryBuilder()
      .update(Track)
      .set({ artist: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }

  async deleteAlbumFromTracks(albumId: string) {
    await this.trackRepo
      .createQueryBuilder()
      .update(Track)
      .set({ album: null })
      .where('albumId = :albumId', { albumId })
      .execute();
  }
}

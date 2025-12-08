import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './artists.entity';
import { validate } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto/artists.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepo: Repository<Artist>,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid artist id (not UUID)');
    }
  }

  getAllArtists() {
    return this.artistRepo.find();
  }

  async getArtistById(id: string) {
    this.validateUUID(id);

    const foundArtist = await this.artistRepo.findOneBy({ id });

    if (!foundArtist) {
      throw new NotFoundException('Not found artist');
    }

    return foundArtist;
  }

  createArtist(dto: CreateArtistDto) {
    if (
      !dto.name ||
      typeof dto.name !== 'string' ||
      typeof dto.grammy !== 'boolean'
    ) {
      throw new BadRequestException('Required name or grammy missing');
    }

    return this.artistRepo.save(dto);
  }

  async updateArtist(id: string, dto: UpdateArtistDto) {
    this.validateUUID(id);

    const foundArtist = await this.artistRepo.findOneBy({ id });

    if (!foundArtist) {
      throw new NotFoundException('Not found artist');
    }

    if (dto.name !== undefined) {
      foundArtist.name = dto.name;
    }

    if (dto.grammy !== undefined) {
      foundArtist.grammy = dto.grammy;
    }

    return this.artistRepo.save(foundArtist);
  }

  async deleteArtist(id: string) {
    this.validateUUID(id);

    const foundArtist = await this.artistRepo.findOneBy({ id });

    if (!foundArtist) {
      throw new NotFoundException('Not found artist');
    }

    await this.albumService.deleteArtistFromAlbums(id);
    await this.tracksService.deleteArtistFromTracks(id);
    await this.artistRepo.remove(foundArtist);
  }
}

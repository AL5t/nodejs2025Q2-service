import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Album } from './albums.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/artists.entity';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private readonly albumRepo: Repository<Album>,
    @InjectRepository(Artist) private readonly artistRepo: Repository<Artist>,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid album id (not UUID)');
    }
  }

  getAllAlbums() {
    return this.albumRepo.find({ relations: ['artist'] });
  }

  async getAlbumById(id: string) {
    this.validateUUID(id);

    const foundAlbum = await this.albumRepo.findOneBy({ id });

    if (!foundAlbum) {
      throw new NotFoundException('Not found album');
    }

    return foundAlbum;
  }

  async createAlbum(dto: CreateAlbumDto) {
    if (
      !dto.name ||
      typeof dto.name !== 'string' ||
      !dto.year ||
      typeof dto.year !== 'number'
    ) {
      throw new BadRequestException('Required name or year missing');
    }

    const artist = dto.artistId
      ? await this.artistRepo.findOneBy({ id: dto.artistId })
      : null;

    return this.albumRepo.save({ ...dto, artist });
  }

  async updateAlbum(id: string, dto: UpdateAlbumDto) {
    this.validateUUID(id);

    const foundAlbum = await this.albumRepo.findOne({
      where: { id },
      relations: ['artist'],
    });

    if (!foundAlbum) {
      throw new NotFoundException('Not found album');
    }

    if (dto.name !== undefined) {
      foundAlbum.name = dto.name;
    }

    if (dto.year !== undefined) {
      foundAlbum.year = dto.year;
    }

    if (dto.artistId !== undefined) {
      foundAlbum.artist = dto.artistId
        ? await this.artistRepo.findOneBy({ id: dto.artistId })
        : null;
    }

    return this.albumRepo.save(foundAlbum);
  }

  async deleteAlbum(id: string) {
    this.validateUUID(id);

    const foundAlbum = await this.albumRepo.findOneBy({ id });

    if (!foundAlbum) {
      throw new NotFoundException('Not found album');
    }

    await this.tracksService.deleteAlbumFromTracks(id);
    await this.albumRepo.remove(foundAlbum);
  }

  async deleteArtistFromAlbums(artistId: string) {
    await this.albumRepo
      .createQueryBuilder()
      .update(Album)
      .set({ artist: null })
      .where('artistId = :artistId', { artistId })
      .execute();
  }
}

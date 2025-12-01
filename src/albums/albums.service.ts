import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4, validate } from 'uuid';
import { Album } from './albumsInterface';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/albums.dto';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(private readonly trackService: TracksService) {}

  private validateUUID(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Invalid album id (not UUID)');
    }
  }

  getAllAlbums(): Album[] {
    return this.albums;
  }

  getAlbumById(id: string): Album {
    this.validateUUID(id);

    const foundAlbum = this.albums.find((album) => album.id === id);

    if (!foundAlbum) {
      throw new NotFoundException('Not found album');
    }

    return foundAlbum;
  }

  createAlbum(dto: CreateAlbumDto): Album {
    if (
      !dto.name ||
      typeof dto.name !== 'string' ||
      !dto.year ||
      typeof dto.year !== 'number'
    ) {
      throw new BadRequestException('Required name or year missing');
    }

    const newAlbum = {
      id: v4(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  updateAlbum(id: string, dto: UpdateAlbumDto): Album {
    this.validateUUID(id);

    const foundAlbum = this.albums.find((album) => album.id === id);

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
      foundAlbum.artistId = dto.artistId;
    }

    return foundAlbum;
  }

  deleteAlbum(id: string): void {
    this.validateUUID(id);

    const foundAlbumIndex = this.albums.findIndex((album) => album.id === id);

    if (foundAlbumIndex === -1) {
      throw new NotFoundException('Not found album');
    }

    this.albums.splice(foundAlbumIndex, 1);

    this.trackService.deleteAlbumFromTracks(id);
  }

  deleteArtistFromAlbums(artistId: string) {
    this.albums = this.albums.map((album) => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}

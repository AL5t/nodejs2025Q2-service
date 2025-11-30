import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Artist } from "./artistsInterface";
import { v4, validate } from "uuid";
import { CreateArtistDto, UpdateArtistDto } from "./dto/artists.dto";
import { AlbumService } from "src/albums/albums.service";
import { TracksService } from "src/tracks/tracks.service";

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TracksService
  ) {}

  private validateUUID(id: string) {
    if(!validate(id)) {
      throw new BadRequestException('Invalid artist id (not UUID)');
    }
  }

  getAllArtists(): Artist[] {
    return this.artists;
  }

  getArtistById(id: string): Artist {
    this.validateUUID(id);

    const foundArtist = this.artists.find(artist => artist.id === id);

    if(!foundArtist) {
      throw new NotFoundException('Not found artist')
    }

    return foundArtist;
  }

  createArtist(dto: CreateArtistDto): Artist {
    if(!dto.name || typeof dto.name !== 'string' || typeof dto.grammy !== 'boolean') {
      throw new BadRequestException('Required name or grammy missing');
    }

    const newArtist = {
      id: v4(),
      name: dto.name,
      grammy: dto.grammy,
    };

    this.artists.push(newArtist);

    return newArtist;
  }

  updateArtist(id: string, dto: UpdateArtistDto): Artist {
    this.validateUUID(id);

    const foundArtist = this.artists.find(artist => artist.id === id);

     if(!foundArtist) {
      throw new NotFoundException('Not found artist')
    }

    if(dto.name !== undefined) {
      foundArtist.name = dto.name;
    }

    if(dto.grammy !== undefined) {
      foundArtist.grammy = dto.grammy;
    }

    return foundArtist;
  }

  deleteArtist(id: string): void {
    this.validateUUID(id);

    const foundArtistIndex = this.artists.findIndex(artist => artist.id === id);

    if(foundArtistIndex === -1) {
      throw new NotFoundException('Not found artist')
    }

    this.artists.splice(foundArtistIndex, 1);

    this.albumService.deleteArtistFromAlbums(id);
    this.trackService.deleteArtistFromTracks(id);
  }
}
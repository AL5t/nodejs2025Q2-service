import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Track } from "./trackInterface";
import { CreateTrackDto, UpdateTrackDto } from "./dto/tracks.dto";
import { v4, validate } from "uuid";

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  private validateUUID(id: string) {
    if(!validate(id)) {
      throw new BadRequestException('Invalid track id (not UUID)');
    }
  }

  getAllTracks(): Track[] {
    return this.tracks;
  }

  getTrackById(id: string): Track {
    this.validateUUID(id);

    const foundTrack = this.tracks.find(track => track.id === id);

    if(!foundTrack) {
      throw new NotFoundException('Track not found');
    }
    return foundTrack;
  }

  createTrack(dto: CreateTrackDto): Track {
    if(!dto.name || typeof dto.name !== 'string' || !dto.duration || typeof dto.duration !== 'number') {
      throw new BadRequestException('Required name or duration missing')
    }

    const newTrack = {
      id: v4(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration
    };

    this.tracks.push(newTrack);

    return newTrack;
  }

  updateTrack(id: string, dto: UpdateTrackDto): Track {
    this.validateUUID(id);

    const foundTrack = this.tracks.find(track => track.id === id);

    if(!foundTrack) {
      throw new NotFoundException('Track not found');
    }

    foundTrack.name = dto.name;
    foundTrack.artistId = dto.artistId;
    foundTrack.albumId = dto.albumId;
    foundTrack.duration = dto.duration;

    return foundTrack;
  }

  deleteTrack(id: string) {
    this.validateUUID(id);

    const foundTrackIndex = this.tracks.findIndex(track => track.id === id);

    if(foundTrackIndex === -1) {
      throw new NotFoundException('Track not found');
    }

    this.tracks.splice(foundTrackIndex, 1);
  }
}
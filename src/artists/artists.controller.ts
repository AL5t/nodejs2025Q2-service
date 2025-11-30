import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artists.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    return this.artistService.getArtistById(id);
  }

  @Post()
  createArtist(@Body() dto: CreateArtistDto) {
    return this.artistService.createArtist(dto);
  }

  @Put(':id')
  updateArtist(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    return this.artistService.updateArtist(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteArtist(@Param('id') id: string) {
    return this.artistService.deleteArtist(id);
  }
}

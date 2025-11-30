import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { AlbumService } from "./albums.service";
import { CreateAlbumDto, UpdateAlbumDto } from "./dto/albums.dto";

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumById(id);
  }

  @Post()
  createAlbum(@Body() dto: CreateAlbumDto) {
    return this.albumService.createAlbum(dto);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    return this.albumService.updateAlbum(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAlbum(@Param('id') id: string) {
    return this.albumService.deleteAlbum(id);
  }
}
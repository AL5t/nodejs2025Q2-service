import { Module } from "@nestjs/common";
import { TracksService } from "./tracks.service";
import { TrackController } from "./tracks.controller";

@Module({
  imports: [],
  controllers: [TrackController],
  providers: [TracksService],
  exports: [TracksService]
})

export class TracksModule {}
import { Module } from '@nestjs/common';
import { DocController } from './doc.controller';

@Module({
  imports: [],
  controllers: [DocController],
  providers: [],
})
export class DocsModule {}

import { Controller, Get, Res } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller('doc')
export class DocController {
  @Get()
  getDoc(@Res() res) {
    const file = readFileSync(
      join(__dirname, '../../doc', 'api.yaml'),
      'utf-8',
    );

    res.setHeader('Content-Type', 'text/yaml');
    res.send(file);
  }
}

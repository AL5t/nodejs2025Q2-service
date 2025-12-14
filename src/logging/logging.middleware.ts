import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject('LoggingService')
    private readonly logger: LoggingService,
  ) {}

  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    const { method, url } = req;

    this.logger.log(`Incoming request: ${method} ${url}`, 'HTTP');

    const chunks: Buffer[] = [];

    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = (...args: any[]) => {
      const [chunk] = args;
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return originalWrite(...args);
    };

    res.end = (...args: any[]) => {
      const [chunk] = args;
      if (chunk) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return originalEnd(...args);
    };

    res.on('finish', () => {
      const ms = Date.now() - start;
      let responseBody = Buffer.concat(chunks).toString('utf8');
      if (responseBody.length > 1000) {
        responseBody = responseBody.slice(0, 1000) + '...';
      }

      this.logger.log(
        `Response ${method} ${url} ${res.statusCode} (${ms}ms) - response=${responseBody}`,
        'HTTP',
      );
    });

    next();
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { LoggingService } from './logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject('LoggingService')
    private readonly logger: LoggingService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<any>();
    const res = ctx.getResponse<any>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const excResp = exception.getResponse();
      message =
        typeof excResp === 'string'
          ? excResp
          : (excResp as any).message || JSON.stringify(excResp);
    }

    const trace =
      exception instanceof Error ? exception.stack : String(exception);

    this.logger.error(
      `HTTP ${req.method} ${req.url} - status ${status} - message: ${message}`,
      trace,
      'ExceptionFilter',
    );

    res.status(status).send({
      statusCode: status,
      message,
    });
  }
}

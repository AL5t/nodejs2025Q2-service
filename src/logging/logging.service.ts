import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LoggingService {
  log(message: string, context?: string): void;
  error(message: string, trace?: string, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
}

@Injectable()
export class FileLoggerService implements LoggingService {
  private level: number;
  private maxFileSizeKB: number;
  private logFilePath: string;

  constructor() {
    this.level =
      process.env.LOG_LEVEL !== undefined ? Number(process.env.LOG_LEVEL) : 2;
    this.maxFileSizeKB = process.env.LOG_MAX_FILE_SIZE_KB
      ? Number(process.env.LOG_MAX_FILE_SIZE_KB)
      : 1024;

    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
    this.logFilePath = path.join(logsDir, 'app.log');

    process.on('uncaughtException', (err) => {
      this.error(`uncaughtException: ${err?.message || err}`, err?.stack);
    });
    process.on('unhandledRejection', (reason) => {
      this.error(`unhandledRejection: ${String(reason)}`);
    });
  }

  private shouldLog(msgLevel: number) {
    return msgLevel <= this.level;
  }

  private write(levelName: string, message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const ctx = context ? ` [${context}]` : '';
    const line = `${timestamp} ${levelName}${ctx}: ${message}\n`;
    try {
      if (fs.existsSync(this.logFilePath)) {
        const stats = fs.statSync(this.logFilePath);
        const sizeKb = Math.ceil(stats.size / 1024);
        if (sizeKb >= this.maxFileSizeKB) {
          for (let i = 5; i >= 1; i--) {
            const older = `${this.logFilePath}.${i}`;
            const newer = `${this.logFilePath}.${i + 1}`;
            if (fs.existsSync(older)) {
              try {
                fs.renameSync(older, newer);
              } catch {}
            }
          }
          try {
            fs.renameSync(this.logFilePath, `${this.logFilePath}.1`);
          } catch {}
        }
      }
      fs.appendFileSync(this.logFilePath, line, { encoding: 'utf8' });
      process.stdout.write(line);
    } catch (err) {
      process.stdout.write(
        `${new Date().toISOString()} ${levelName}:${message}\n`,
      );
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (!this.shouldLog(0)) return;
    const full = trace ? `${message}\nTrace: ${trace}` : message;
    this.write('ERROR', full, context);
  }
  warn(message: string, context?: string) {
    if (!this.shouldLog(1)) return;
    this.write('WARN', message, context);
  }
  log(message: string, context?: string) {
    if (!this.shouldLog(2)) return;
    this.write('LOG', message, context);
  }
  debug(message: string, context?: string) {
    if (!this.shouldLog(3)) return;
    this.write('DEBUG', message, context);
  }
  verbose(message: string, context?: string) {
    if (!this.shouldLog(4)) return;
    this.write('VERBOSE', message, context);
  }
}

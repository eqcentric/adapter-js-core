import { LOG } from '@configs/log';
import winston, { Logger } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

export class LoggingService {
  req: Request;

  constructor(req: Request) {
    this.req = req;
  }

  getLogger(): Logger {
    const channel: string = process.env.LOG_CHANNEL;

    if (channel === 'stderr') {
      return this.stderr();
    }

    if (channel === 'single') {
      return this.single();
    }

    return this.single();
  }

  single(): Logger {
    const format = this.getFormat();
    format.transports = [
      new winstonDaily({
        level: LOG.channels.stderr.level,
        datePattern: 'YYYY-MM-DD',
        dirname: LOG.channels.single.path,
        filename: `%DATE%.log`,
        maxFiles: 30,
        json: false,
        zippedArchive: false,
      }),
    ];
    return winston.createLogger(format);
  }
  stderr(): Logger {
    const logger = winston.createLogger(this.getFormat());
    logger.add(new winston.transports.Console({}));
    return logger;
  }
  private getFormat(): any {
    const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);
    return {
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
      ),
    };
  }
}

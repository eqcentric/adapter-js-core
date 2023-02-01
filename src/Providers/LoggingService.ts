import ProviderContract from '@providers/ProviderContract';
import { LOG } from '@configs/log';
import winston, { Logger } from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import WinstonCloudWatch from 'winston-cloudwatch';
import AWS from 'aws-sdk';
import { get } from 'lodash';

class LoggingService {
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

    return this.cloudwatch();
  }

  cloudwatch(): Logger {
    AWS.config.update({
      accessKeyId: LOG.channels.cloudwatch.secret_key,
      secretAccessKey: LOG.channels.cloudwatch.access_key,
      region: LOG.channels.cloudwatch.region,
    });

    const logger = winston.createLogger(this.getFormat());
    // const trans: internalTransDto = container.resolve('trans');
    // @TOD : put log to ECS
    const loggerConfig: any = {
      cloudWatchLogs: new AWS.CloudWatchLogs(),
      logGroupName: '/aws/makini/integrations/' + get(this.req, 'query.trans.env'),
      logStreamName: get(this.req, 'query.trans.id'),
      transports: [new winston.transports.Console({})],
    };
    logger.add(new WinstonCloudWatch(loggerConfig));

    return logger;
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

export default LoggingService;

import winston from 'winston';

const format = winston.format.printf(
  ({ level, message, timestamp, cid, metadata }) => {
    let logMessage = `${timestamp} [CID: ${cid || 'N/A'}] ${level}: ${message}`;

    if (metadata && Object.keys(metadata).length >= 1) {
      logMessage += ` | Metadata: ${JSON.stringify(metadata)}`;
    }

    return logMessage;
  }
);

const baseLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), format),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        format
      ),
    }),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});

const logger = (cid?: string, metadata: Record<string, any> = {}) => ({
  info: (message: string) => baseLogger.info(message, { cid, metadata }),
  error: (message: string) => baseLogger.error(message, { cid, metadata }),
  warn: (message: string) => baseLogger.warn(message, { cid, metadata }),
});

export default logger;

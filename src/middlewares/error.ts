import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;
import Log from '../core/schemas/Log';

interface LogEntry {
    level: string; 
    message: string;
    timestamp: number; 
}
interface TransformableInfo {
    level: string;
    message: string;
    [key: string]: any;
  }

const logFormat = printf((info: TransformableInfo) => {
    console.log(info);
    const { level, message, timestamp } = info as LogEntry;
    return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' })
    ]
});

logger.on('data', (log : LogEntry) => {
    const logEntry = new Log({
        level: log.level,
        message: log.message,
        timestamp: new Date(log.timestamp)
    });
    logEntry.save().catch(err => console.error('Error saving log to MongoDB', err));
});

export default logger;
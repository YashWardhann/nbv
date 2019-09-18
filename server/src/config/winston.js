import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

// Directory for the log files 
const logDir = './src/logs';

// Check if the directory exists 
if(!fs.existsSync(logDir)) {
    // Create the logs directory if it doesnt exist
    fs.mkdirSync(logDir); 
    console.log('Created Log Directory');
}



const { combine, timestamp, label, printf } = format;

// Create custom format for logging to files
const loggerFormatFile = printf(({level, message, timestamp}) => {
    return `${timestamp} [${level}]: ${message}`;
});

const loggerFormatConsole = printf(info => `[${info.level}] ${info.message}`);

// Convert objects to strings for logging 
const prettyJson = format.printf(info => {
    if (info.message.constructor == Object) {
        info.message = JSON.stringify(info.message, null, 4);
    }

    return `[${info.level}] ${info.message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        loggerFormatFile,
    ),

    transports: [
        // - Print all logs to the console
        new transports.Console({
            colorize: 'all',
            format: combine(
                format.colorize(),
                loggerFormatConsole, 
                prettyJson
            ), 
            silent: process.env.NODE_ENV === 'test' // Disable logging to console while testing
        }),

        // - Write all logs with level 'info' and 'error' to 'combined.log'
        // - Write all logs with level 'error' to 'error.log'
        // - Write all logs with level 'warn' to 'error.log'
        new transports.File({ filename: path.join(logDir, '/combined.log') }),
        new transports.File({ filename: path.join(logDir, '/error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'warn' })
        
    ]
});

export default logger;
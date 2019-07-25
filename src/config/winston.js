import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

// Directory for the log files 
const logDir = './src/logs';

// Check if the directory exists 
if(!fs.existsSync(logDir)) {
    // Create the logs directory if it doesnt exist
    fs.mkdirSync(logDir); 
    console.log('Created Directory');
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
        // - Print all logs with level 'info' and 'error' to the console
        new transports.Console({
            colorize: 'all',
            format: combine(
                format.colorize(),
                loggerFormatConsole, 
                prettyJson
            )
        }),

        // - Write all logs with level 'info' and 'error' to 'combined.log'
        // - Write all logs with level 'error' to 'error.log'
        new transports.File({ filename: path.join(logDir, '/combined.log') }),
        new transports.File({ filename: path.join(logDir, '/error.log'), level: 'error' })
        
    ]
});

export default logger;
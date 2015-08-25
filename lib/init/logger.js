//var path = require('path');
var winston = require('winston');
var CONFIG = require('config');

winston.emitErrs = true;

//var logFile = path.join(__dirname, '..', 'logs/log.log');
var logger = new winston.Logger({
    transports: [
        //new winston.transports.File({
        //    level: CONFIG.LOG_LEVEL,
        //    filename: logFile,
        //    handleExceptions: true,
        //    json: false,
        //    maxsize: 5242880, //5MB
        //    maxFiles: 5,
        //    colorize: true
        //}),
        new winston.transports.Console({
            level: CONFIG.LOG_LEVEL,
            handleExceptions: false,
            json: false,
            colorize: true,
            timestamp: true
        })

    ],
    exitOnError: false
});

//logger.debug('logging to file', logFile);

module.exports = logger;

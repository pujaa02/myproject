var winston = require("winston");
const { createLogger, format, transports } = require('winston');

const combinedLogger = new winston.transports.File({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
  ),
  name: "data",
  filename: "./logs/combined.log",
  level: "info",
})

const infoLogger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
  ),
  defaultMeta: { service: "log-service" },
  transports: [
    new winston.transports.File({
      name: "info",
      filename: "./logs/info.log",
      level: "info",
    }),
    combinedLogger
  ],
});

const errorLogger = winston.createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`+(info.splat!==undefined?`${info.splat}`:" "))
  ),
  defaultMeta: { service: "log-service" },
  transports: [
    new winston.transports.File({
      name: "error",
      filename: "./logs/error.log",
      level: "error",
    }),
    combinedLogger
  ],
});

const logger = {
  info: (params) => {
    return infoLogger.info(params);
  },
  error: (params) => {
    return errorLogger.error(params);
  },
};
module.exports = logger;
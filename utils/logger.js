const {
    createLogger,
    format,
    transports,
    config,
    addColors,
} = require("winston");
require("winston-mongodb");

require("dotenv").config();
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

addColors(colors);

let logger = createLogger({
    transports: [
        new transports.Console({
            level: "error",
            format: format.combine(
                format.colorize({
                    all: true,
                    colors: colors,
                    level: true,
                    message: true,
                }),
                format.timestamp({
                    format: "DD/MM/YYYY, HH:mm:ss",
                }),
                format.metadata(),
                format.align(),
                format.prettyPrint({
                    colorize: true,
                    depth: 10,
                }),
                format.printf(
                    (info) =>
                        `${info.level}  - ${info.metadata.timestamp}  ${info.message}${info.metadata.message ? " - " + info.metadata.message : ""}${info.metadata.label ? " - " + info.metadata.label : ""}`,
                ),
            ),
            handleExceptions: true,
        }),
        new transports.MongoDB({
            level: "error",
            //mongo database connection link
            db: `${process.env.MONGO_URI}`,
            // silent: true,
            options: {
                // useUnifiedTopology: true,
                // useNewUrlParser: true,
            },
            // A collection to save json formatted logs
            collection: "server_logs",
            format: format.combine(
                format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                format.metadata(),

                // Convert logs to a json format
                format.json(),
            ),
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});

const myStream = logger.stream = {
    write: function(message){
        logger.http(message);
    }
};

module.exports = {
    logger,
    myStream
};

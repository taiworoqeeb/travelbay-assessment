const {logger} = require("./logger")


/**
 * Handles graceful shutdown of an express server and closes a mongoose connection
 * @param {http.Server} server - The http server that needs to be closed
 * @param {import('mongoose').Mongoose} mongoose - The mongoose instance managing the database connection
 * @param {object} [options] - Options object
 * @param {boolean} [options.coredump=false] - Whether to generate a core dump on crash
 * @param {number} [options.timeout=1000] - The number of milliseconds to wait until the process is forcefully terminated
 * @returns {function(number, string | undefined, Error | undefined, Promise<any> | undefined): void} - The function to call when app termination or crash needs to be handled
 */
function terminate (server, mongoose, options = { coredump: false, timeout: 1000 }) {
      // Exit function
      const exit = code => {
            options.coredump ? process.abort() : process.exit(code)
      }

      return (code, reason) => (err, promise) => {
            if (err && err instanceof Error) {
                  // Log error information, using a proper error library(probably winston)
                  logger.error(err.message, [{error:err.stack, reason: reason}])
            }


            //close db connection
            const dbErrorMessage = code == 0
                  ? "MongoDB connection closed due to app termination"
                  : "MongoDB connection closed due to app crash"
            logger.error(dbErrorMessage)
            if(code == 0) {
                  mongoose.disconnect()
            }
            // Attempt a graceful shutdown
            server.close(exit)
            setTimeout(exit, options.timeout).unref()
      }
}

/**
 *
 * @param {Error} error
 * @returns formatted error message
 */
function errorMessageHandler(error) {
      return message
            = error.name  === "MongoServerError" ? "Unable to handle request, please try again in a few seconds"
            : error.name === "CastError" ? "Unable to handle request, an invalid _id is sent"
            : error.message
}

module.exports = {terminate, errorMessageHandler}

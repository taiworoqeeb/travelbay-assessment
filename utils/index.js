const jwt = require("jsonwebtoken");


/**
 * responseHandler
 * @function
 * @param {Object} options - Response options
 * @param {String} options.message - Response message
 * @param {Boolean} options.status - Response status
 * @param {Number} options.statusCode - HTTP status code
 * @param {Object} options.data - Response data
 * @returns {Object} - Response object
 */
const responseHandler = ({message, status, statusCode, data}) => {
    return (response = { message, status, statusCode, data });
  };
/**
 * tokenHandler
 * @function
 * @param {Object} data - User data
 * @param {String} userType - User type
 * @returns {Object} - Token object
 * @throws {Error} - Unable to generate token
 */
const tokenHandler = ( data, userType) => {
    try {
        const { _id, name, email, status } = data
        let identification =  userType === "user" ? "userId"
          : "adminId";


        const token = jwt.sign(
          { [identification]: _id, email, name, status, userType },
          process.env.JWT_SECRET,
          {
            expiresIn: '2d',
          }
        )
      return { token: `Bearer ${token}`, [identification]: _id, email, name, status, userType }
    } catch (error) {
      throw new Error("Unable to generate token.");
    }
  };

module.exports = {
    tokenHandler,
    responseHandler
}

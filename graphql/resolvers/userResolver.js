const bcrypt = require('bcryptjs');
const {User} = require('../../models/userModel');
const { responseHandler, tokenHandler } = require('../../utils');

class UserResolver{
    constructor(userModel){
        this.userModel = User;
    }

    /**
     * Creates a new user.
     * @param {Object} data - data must contain email, password, firstName, lastName, and phoneNumber
     * @returns {Promise<Object>}
     */
    async registerAccount(data) {
        const checkEmail = await this.userModel.findOne({email: data.email});
        if(checkEmail){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "User account email already exist",
                data: {}
            })
        }

        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        const user = await this.userModel.create(data);

        const token = tokenHandler(user, "user")

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "User account created successfully",
            data: {
                user: token
            }
        })
    }

    /**
     * Authenticates a user using their email and password.
     * @param {Object} data - The login credentials.
     * @param {string} data.email - The email of the user.
     * @param {string} data.password - The password of the user.
     * @returns {Promise<Object>} - A response indicating success or failure.
     * The response includes a message and a user token on success, or an error message on failure.
     */
    async loginAccount(data) {
        const user = await this.userModel.findOne({email: data.email});
        if(!user){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "invalid login credentials",
                data: {}
            })
        }

        if(!bcrypt.compareSync(data.password, user.password)){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "Invalid login credentials",
                data: {}
            })
        }

        const token = tokenHandler(user, "user")

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "User account logged in successfully",
            data: {
                user: token
            }
        })
    }

    /**
     * Retrieves the profile of a user by their ID.
     * @param {Object} data - The request data containing user ID.
     * @param {string} data.userId - The unique identifier of the user.
     * @returns {Promise<Object>} - A response object indicating success or failure.
     * The response includes user data on success, or an error message if the user is not found.
     */
    async getUserProfile(data) {
        const user = await this.userModel.findById(data.userId);
        if(!user){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "User account not found",
                data: {}
            })
        }

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "User account fetched successfully",
            data: {user: user}
        })
    }
}

const userResolver = new UserResolver();

module.exports = userResolver;

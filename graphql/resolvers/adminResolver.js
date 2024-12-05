const bcrypt = require('bcryptjs');
const {Admin} = require('../../models/adminModel');
const { responseHandler, tokenHandler } = require('../../utils');
const { User } = require('../../models/userModel');

class AdminResolver{
    constructor(adminModel){
        this.adminModel = Admin;
        this.userModel = User
    }

    /**
     * Creates a new admin user.
     * @param {Object} data - data must contain email, password, firstName, lastName, and phoneNumber
     * @returns {Promise<Object>}
     */
    async registerAccount(data) {
        const checkEmail = await this.adminModel.findOne({email: data.email});
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
        const user = await this.adminModel.create(data);

        const token = tokenHandler(user, "admin")

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "Admin account created successfully",
            data: {
                user: token
            }
        })
    }

    /**
     * Authenticates an admin user using their email and password.
     * @param {Object} data - The login credentials.
     * @param {string} data.email - The email of the admin user.
     * @param {string} data.password - The password of the admin user.
     * @returns {Promise<Object>} - A response indicating success or failure.
     * The response includes a message and a user token on success, or an error message on failure.
     */
    async loginAccount(data) {
        const user = await this.adminModel.findOne({email: data.email});
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

        const token = tokenHandler(user, "admin")

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "Admin account logged in successfully",
            data: {
                user: token
            }
        })
    }

    /**
     * Fetches the profile of an admin user by their ID.
     * @param {Object} data - The request data.
     * @param {string} data.userId - The ID of the admin user.
     * @returns {Promise<Object>} - A response indicating success or failure.
     * The response includes a message and the user data on success, or an error message on failure.
     */
    async getUserProfile(data) {
        const user = await this.adminModel.findById(data.userId);
        if(!user){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "Admin account not found",
                data: {}
            })
        }

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "Admin account fetched successfully",
            data: {user: user}
        })
    }

    async getAllUsers(){
        const users = await this.userModel.find();

        if(users.length === 0){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "No users found",
                data: []
            })
        }

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "Users fetched successfully",
            data: {users: users}
        })
    }

    /**
     * Fetches a user based on the provided user ID
     * @param {Object} data - The data object containing the user ID
     * @param {string} data.userId - The ID of the user to be fetched
     * @returns {Promise<Object>} - The response containing the user data or an error message
     */
    async getUser(data){
        const user = await this.userModel.findById(data.userId);

        if(!user){
            return responseHandler({
                status: false,
                statusCode: 400,
                message: "User not found",
                data: {}
            })
        }

        return responseHandler({
            status: true,
            statusCode: 200,
            message: "User fetched successfully",
            data: {user: user}
        })
    }
}

const adminResolver = new AdminResolver();

module.exports = adminResolver;

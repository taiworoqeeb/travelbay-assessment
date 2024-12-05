const GraphQL = require('graphql');

const {
	GraphQLList,
	GraphQLID,
    GraphQLString,
	GraphQLNonNull,
} = GraphQL;


// import the user resolver we created
const adminResolver = require('../resolvers/adminResolver');
const {responseType} = require('../type/responseType');
const { isAuthenticated } = require('../../config/auth');
const { responseHandler } = require('../../utils');

module.exports = {

	/**
	 * Get the profile of an admin user
	 *
	 * This will return data of a single users based on the id provided
	 *
	 * @param {Object} parent - The parent object
	 * @param {Object} args - An object containing the query arguments
	 * @param {Object} context - The context object which contains information about the current request
	 * @param {Object} info - The info object which contains information about the current query
	 *
	 * @return {Promise<Object>} - The response object
	 */
	getAdminQuery() {
		return {
			type: responseType,
			description: 'This will return data of a single users based on the id provided',
			resolve(parent, args, context, info) {
				if(isAuthenticated(context)){
					return adminResolver.getUserProfile({ userId: context.user._id });
				}else{
					return responseHandler({
						status: false,
						statusCode: 400,
						message: 'Admin is not logged in (or authenticated).',
						data: {}
					})
				}

			}
		}
	},

	/**
	 * Get all users
	 *
	 * This will return data of all users
	 *
	 * @param {Object} parent - The parent object
	 * @param {Object} args - An object containing the query arguments
	 * @param {Object} context - The context object which contains information about the current request
	 * @param {Object} info - The info object which contains information about the current query
	 *
	 * @return {Promise<Object>} - The response object
	 */
	getAllUsersQuery() {
		return {
			type: responseType,
			description: 'This will return data of all users',
			resolve(parent, args, context, info) {
				if(isAuthenticated(context)){
					return adminResolver.getAllUsers();
				}else{
					return responseHandler({
						status: false,
						statusCode: 400,
						message: 'Admin is not logged in (or authenticated).',
						data: {}
					})
				}

			}

		}
	},

	/**
	 * Get user data by user ID
	 *
	 * This query retrieves data of a single user based on the provided user ID.
	 *
	 * @param {Object} parent - The parent object
	 * @param {Object} args - An object containing the query arguments, including the user ID
	 * @param {string} args.userId - The ID of the user to retrieve
	 * @param {Object} context - The context object which contains information about the current request
	 * @param {Object} info - The info object which contains information about the current query
	 *
	 * @return {Promise<Object>} - The response object containing user data or an error message
	 */
	getUserQuery(){
		return {
			type: responseType,
			description: 'This will return data of a single users based on the id provided',
			args: {
				userId: {
					type: new GraphQLNonNull(GraphQLString),
					description: 'Enter user id',
				},
			},
			resolve(parent, args, context, info) {
				if(isAuthenticated(context)){
					return adminResolver.getUser({ userId: args.userId });
				}else{
					return responseHandler({
						status: false,
						statusCode: 400,
						message: 'Admin is not logged in (or authenticated).',
						data: {}
					})
				}

			}
		}
	}



};

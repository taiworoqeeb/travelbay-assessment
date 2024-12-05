const GraphQL = require('graphql');

const {
	GraphQLList,
	GraphQLID,
    GraphQLString,
	GraphQLNonNull,
} = GraphQL;


// import the user resolver we created
const userResolver = require('../resolvers/userResolver');
const {responseType} = require('../type/responseType');
const { isAuthenticated } = require('../../config/auth');
const { responseHandler } = require('../../utils');

module.exports = {

/**
 * Retrieve the profile of the currently authenticated user.
 *
 * This query fetches data for a single user based on the authenticated user's ID from the context.
 *
 * @param {Object} parent - The parent object
 * @param {Object} args - An object containing the query arguments
 * @param {Object} context - The context object which contains information about the current request, including the authenticated user
 * @param {Object} info - The info object which contains information about the current query
 *
 * @return {Promise<Object>} - The response object containing user data or an error message
 */
	getUserQuery() {
		return {
			type: responseType,
			description: 'This will return data of a single users based on the id provided',
			resolve(parent, args, context, info) {
				if(isAuthenticated(context)){
					return userResolver.getUserProfile({ userId: context.user._id });
				}else{
					return responseHandler({
						status: false,
						statusCode: 400,
						message: 'User is not logged in (or authenticated).',
						data: {}
					})
				}

			}
		}
	},



};

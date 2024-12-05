const GraphQL = require('graphql');
const validator = require('validator');
const {
	GraphQLList,
	GraphQLID,
    GraphQLString,
	GraphQLNonNull,
} = GraphQL;


// import the user resolver we created
const packageResolver = require('../resolvers/packageResolver');
const {responseType} = require('../type/responseType');
const { isAuthenticated } = require('../../config/auth');
const { responseHandler } = require('../../utils');


module.exports = {
/**
 * Get all the user's packages
 *
 * This query retrieves all the packages for the provided user ID.
 *
 * @param {Object} parent - The parent object
 * @param {Object} fields - An object containing the query arguments, including the user ID
 * @param {string} fields.userId - The ID of the user to retrieve packages of
 * @param {Object} context - The context object which contains information about the current request
 * @param {Object} info - The info object which contains information about the current query
 *
 * @return {Promise<Object>} - The response object containing the user's packages or an error message
 */
    getAllUserPackagesQuery(){
        return {
            type: responseType,
            description: 'Get all the user\'s packages',

            args: {
                userId: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'User ID cannot be left empty',
                }
            },
            resolve(parent, fields, context, info) {
                // if(!validator.isMongoId(fields.userId)){
                //     return responseHandler({
                //         status: false,
                //         statusCode: 400,
                //         message: 'Invalid user id',
                //         data: {}
                //     })
                // }
                if(isAuthenticated(context)){
                    if(context.userType == "user"){
                        if(context.userId !== fields.userId){
                            return responseHandler({
                                status: false,
                                statusCode: 400,
                                message: 'Unauthorized',
                                data: {}
                            })
                        }
                        return packageResolver.getAllUserPackagesResolver(fields);
                    }else{
                        return responseHandler({
                            status: false,
                            statusCode: 400,
                            message: 'Unauthorized',
                            data: {}
                        })
                    }
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

/**
 * Retrieve a single package by ID
 *
 * This query fetches data for a specific package based on the provided package ID.
 *
 * @param {Object} parent - The parent object
 * @param {Object} args - An object containing the query arguments, including the package ID
 * @param {string} args.packageId - The ID of the package to retrieve
 * @param {Object} context - The context object which contains information about the current request
 * @param {Object} info - The info object which contains information about the current query
 *
 * @return {Promise<Object>} - The response object containing the package data or an error message
 */
    getPackageQuery(){
        return {
            type: responseType,
            description: 'This will return data of a single packages based on the id provided',
            args: {
                packageId: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter package id',
                },
            },
            resolve(parent, args, context, info) {

                // if(!validator.isMongoId(args.packageId)){
                //     return responseHandler({
                //         status: false,
                //         statusCode: 400,
                //         message: 'Invalid package id',
                //         data: {}
                //     })
                // }

                if(isAuthenticated(context)){
                    return packageResolver.getPackageResolver(args);
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

/**
 * Retrieve all packages
 *
 * This query fetches data for all packages, regardless of user ID.
 *
 * @param {Object} parent - The parent object
 * @param {Object} args - An object containing the query arguments
 * @param {Object} context - The context object which contains information about the current request
 * @param {Object} info - The info object which contains information about the current query
 *
 * @return {Promise<Object>} - The response object containing the packages data or an error message
 */
    getAdminAllPackagesQuery(){
        return {
            type: responseType,
            description: 'Get all the packages',
            resolve(parent, args, context, info) {
                if(isAuthenticated(context)){
                    if(context.userType == "admin"){
                        return packageResolver.getAdminAllPackagesResolver();
                    }else{
                        return responseHandler({
                            status: false,
                            statusCode: 400,
                            message: 'Unauthorized',
                            data: {}
                        })
                    }
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

/**
 * Retrieve packages filtered by start and end dates for admin users
 *
 * This query fetches data for packages filtered by a specified date range.
 * Only authenticated admin users are allowed to access this data.
 *
 * @param {Object} parent - The parent object
 * @param {Object} args - An object containing the query arguments
 * @param {string} args.startDate - The start date for filtering packages, cannot be empty
 * @param {string} args.endDate - The end date for filtering packages, cannot be empty
 * @param {Object} context - The context object which contains information about the current request
 * @param {Object} info - The info object which contains information about the current query
 *
 * @return {Promise<Object>} - The response object containing the filtered packages data or an error message
 */
    adminFilterPackageQuery(){
        return {
            type: responseType,
            description: 'Get all the packages',
            args: {
                startDate: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Start date cannot be left empty',
                },
                endDate: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'End date cannot be left empty',
                },
            },
            resolve(parent, args, context, info) {

                if(!validator.isDate(args.startDate) || !validator.isDate(args.endDate)){
                    return responseHandler({
                        status: false,
                        statusCode: 400,
                        message: 'Please enter a valid date',
                        data: {}
                    })
                }

                if(isAuthenticated(context)){
                    if(context.userType == "admin"){
                        return packageResolver.adminFilterPackagesResolver(args);
                    }else{
                        return responseHandler({
                            status: false,
                            statusCode: 400,
                            message: 'Unauthorized',
                            data: {}
                        })
                    }
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

    /**
     * This query fetches all the packages for a given user based on the expiration date filter
     *
     * @param {string} startDate - Start date of the package
     * @param {string} endDate - End date of the package
     * @param {string} userId - User ID of the user
     * @returns {Promise<Object>} - A promise object containing the packages data or an error message
     */
    userFilterPackageQuery(){
        return {
            type: responseType,
            description: 'Get all the packages',
            args: {
                startDate: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Start date cannot be left empty',
                },
                endDate: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'End date cannot be left empty',
                },
                userId: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'User ID cannot be left empty',
                }
            },
            resolve(parent, args, context, info) {

                if(!validator.isDate(args.startDate) || !validator.isDate(args.endDate)){
                    return responseHandler({
                        status: false,
                        statusCode: 400,
                        message: 'Please enter a valid date',
                        data: {}
                    })
                }

                // if(!validator.isMongoId(args.userId)){
                //     return responseHandler({
                //         status: false,
                //         statusCode: 400,
                //         message: 'Invalid user id',
                //         data: {}
                //     })
                // }

                if(isAuthenticated(context)){
                    if(context.userType == "user"){
                        return packageResolver.userFilterPackagesResolver(args);
                    }else{
                        return responseHandler({
                            status: false,
                            statusCode: 400,
                            message: 'Unauthorized',
                            data: {}
                        })
                    }
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

    }

}

const GraphQL = require('graphql');
var validator = require('validator');
const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList
} = GraphQL

// lets import our package resolver
const packageResolver = require('../resolvers/packageResolver');
const {responseType} = require('../type/responseType');
const { responseHandler } = require('../../utils');
const { isAuthenticated } = require('../../config/auth');


module.exports = {
    /**
     * Create a new package for the user
     * @param {string} name - Full name of the package
     * @param {string} description - Description of the package
     * @param {int} price - Price of the package
     * @param {string} expiresAt - Expiration date of the package
     * @param {string} userId - User id of the user creating the package
     * @returns {object} - The newly created package
     */
    createPackage() {
        return {
            type: responseType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter full name, Cannot be left empty',
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter description',
                },
                price: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Enter price',
                },
                expiresAt: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter expiration date',
                },
                userId: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter user id',
                },
            },
            resolve: (parent, args, context, info) => {
                // if(!validator.isMongoId(args.userId)){
                //     return responseHandler({
                //         status: false,
                //         statusCode: 400,
                //         message: 'Invalid user id',
                //         data: {}
                //     })
                // }

                if(!validator.isDate(args.expiresAt)){
                    return responseHandler({
                        status: false,
                        statusCode: 400,
                        message: 'Please enter a valid date',
                        data: {}
                    })
                }


                if(isAuthenticated(context)){
                    if(context.userType == "user"){
                        return packageResolver.createAPackageResolver(args);
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
     * Updates a package
     * @param {String} packageId - ID of package to update
     * @param {String} name - New name for package
     * @param {String} description - New description for package
     * @param {Number} price - New price for package
     * @returns {Object} - API response object
     */
    updatePackage() {
        return {
            type: responseType,
            args: {
                packageId: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter package id',
                },
                name: {
                    type: GraphQLString,
                    description: 'Enter full name, Cannot be left empty',
                },
                description: {
                    type: GraphQLString,
                    description: 'Enter description',
                },
                price: {
                    type: GraphQLInt,
                    description: 'Enter price',
                },
            },
            resolve (parent, args, context, info){

                // if(!validator.isMongoId(args.packageId)){
                //     return responseHandler({
                //         status: false,
                //         statusCode: 400,
                //         message: 'Invalid package id',
                //         data: {}
                //     })
                // }

                if(isAuthenticated(context)){
                    if(context.userType == "user"){
                        return packageResolver.updatePackageResolver(args)
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
     * Deletes a package
     * @param {string} packageId - package id that is to be deleted
     * @returns {object} - response object
     */
    deletePackage() {
        return {
            type: responseType,
            args: {
                packageId: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter package id',
                },
            },
            resolve (parent, args, context, info){

                // if(!validator.isMongoId(args.packageId)){
                //     return responseHandler({
                //         status: false,
                //         statusCode: 400,
                //         message: 'Invalid package id',
                //         data: {}
                //     })
                // }

                if(isAuthenticated(context)){
                    if(context.userType == "user"){
                        return packageResolver.deletePackageResolver(args)
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

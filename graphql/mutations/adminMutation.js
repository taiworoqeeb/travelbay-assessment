const GraphQL = require('graphql');
var validator = require('validator');


const {
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList
} = GraphQL

// lets import our user resolver
const adminResolver = require('../resolvers/adminResolver');
const {responseType} = require('../type/responseType');
const { responseHandler } = require('../../utils');



module.exports = {

    /**
     * @description Login User Mutation
     * @param {string} email - The email associated with the user
     * @param {string} password - The password associated with the user
     * @return {object} The user object with the token
     */
    loginMutation() {
        return {
            type: responseType,
            description: 'Login User',

            args: {
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Email cannot be left empty',
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Password cannot be left empty',
                }
            },
            resolve(parent, fields) {
                return adminResolver.loginAccount(fields);
            }
        }
    },

    /**
     * @description Register new User Mutation
     * @param {string} name - The name associated with the user
     * @param {string} email - The email associated with the user
     * @param {string} password - The password associated with the user
     * @return {object} The user object with the token
     */
    RegisterMutation() {
        return {
            type: responseType,
            description: 'Add new User',

            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter full name, Cannot be left empty',
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter email',
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Enter password, will be automatically hashed',
                }
            },
            resolve(parent, fields) {
                if (!validator.isLength(fields.password, {min: 6, max: undefined})) {
                    return responseHandler({
                        status: false,
                        statusCode: 400,
                        message: "Your password should be greater then " + 6 + " characters!",
                        data: {}
                    })
                }

                return adminResolver.registerAccount(fields);
            }
        }
    },


};

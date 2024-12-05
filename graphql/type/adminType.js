
const GraphQL = require('graphql');
const { UserType } = require('./userType');
const {
	GraphQLObjectType,
	GraphQLString,
    GraphQLBoolean,
	GraphQLID,
	GraphQLInt,
    GraphQLList,
} = GraphQL;

const AdminType = new GraphQLObjectType({
	name: 'AdminType',
	description: 'admin type for managing all the users in our application.',

	/**
	 * The fields of the admin type
	 * @property {GraphQLID} userId - ID of the user, Generated automatically by MongoDB
	 * @property {GraphQLID} adminId - ID of the admin, Generated automatically by MongoDB
	 * @property {GraphQLID} _id - ID of the admin, Generated automatically by MongoDB
	 * @property {GraphQLString} name - Full name of the user
	 * @property {GraphQLString} email - Email address of the user, must be valid and unique
	 * @property {GraphQLString} status - Status of the user, whether active or disabled
	 * @property {GraphQLString} userType - Type of user, whether admin or user
	 * @property {GraphQLString} token - Generate system to allow user to have secure resource access
	 * @property {GraphQLString} createdAt - Date and time when this users account was created
	 * @property {GraphQLString} updatedAt - Date and time when this users account was last updated
	 */
	fields: () => ({
		userId: {
			type: GraphQLID,
			description: 'ID of the user, Generated automatically by MongoDB',
		},
        adminId: {
			type: GraphQLID,
			description: 'ID of the admin, Generated automatically by MongoDB',
		},
		_id:{
			type: GraphQLID,
			description: 'ID of the admin, Generated automatically by MongoDB',
		},
		name: {
			type: GraphQLString,
			description: 'Full name of the user',
		},

		email: {
			type: GraphQLString,
			description: 'Email address of the user, must be valid and unique',
		},

		status: {
			type: GraphQLString,
			description: 'Status of the user, whether active or disabled',
		},

        userType:{
            type: GraphQLString,
            description: 'Type of user, whether admin or user',
        },

		token: {
			type: GraphQLString,
			description: 'Generate system to allow user to have secure resource access',
		},
		createdAt: {
			type: GraphQLString,
			description: 'Date and time when this users account was created',
		},
		updatedAt: {
			type: GraphQLString,
			description: 'Date and time when this users account was last updated',
		},

	})

});

const Admin = new GraphQLObjectType({
	name: 'Admin',
	description: 'admin type for managing all the users in our application.',

		/**
		 * This field returns a list of all the admins.
		 * It is using the AdminType which is defined above.
		 * It will return a list of all the admins with their respective
		 * fields such as id, name, email, status, userType, token, createdAt, updatedAt
		 */
	fields: () => ({
		admin: {
			type: AdminType,
			description: 'List of all the admins',
		}
	})
})

const Admins = new GraphQLObjectType({
	name: 'Admins',
	description: "Admin type for managing all the users in our application.",

		/**
		 * This field returns a list of all the admins.
		 * It is using the AdminType which is defined above.
		 * It will return a list of all the admins with their respective
		 * fields such as id, name, email, status, userType, token, createdAt, updatedAt
		 */
	fields: () => ({
		admins: {
			type: new GraphQLList(AdminType),
			description: 'List of all the admins',
		}
	})
})



module.exports = {
	Admin,
	Admins

};


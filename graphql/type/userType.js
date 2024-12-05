
const GraphQL = require('graphql');
const {
	GraphQLObjectType,
	GraphQLString,
    GraphQLBoolean,
	GraphQLID,
	GraphQLInt,
    GraphQLList,
} = GraphQL;

const UserType = new GraphQLObjectType({
	name: 'UserType',
	description: 'User type for managing all the users in our application.',

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
			description: 'ID of the user, Generated automatically by MongoDB',
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

const User = new GraphQLObjectType({
	name: 'User',
	description: "User type for managing all the users in our application.",

	fields: () => ({
		user:{
			type: UserType,
			description: 'User type for managing all the users in our application.',
		}
	})
})

const Users = new GraphQLObjectType({
	name: 'Users',
	description: "User type for managing all the users in our application.",

	fields: () => ({
		users: {
			type: new GraphQLList(UserType),
			description: 'List of all users',
		}
	})
});





module.exports = {
	User,
	Users,
	UserType
};


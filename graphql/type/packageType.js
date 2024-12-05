
const GraphQL = require('graphql');
const { UserType } = require('./userType');
const {
	GraphQLObjectType,
	GraphQLString,
    GraphQLBoolean,
	GraphQLID,
	GraphQLInt,
    GraphQLList,
    GraphQLUnionType
} = GraphQL;

const PackageType = new GraphQLObjectType({
	name: 'PackageType',
	description: 'Package type for managing all the packages in our application.',

        /**
         * Fields of the package
         * @property {GraphQLID} _id - ID of the package, Generated automatically by MongoDB
         * @property {GraphQLString} name - Name of the package
         * @property {GraphQLString} description - Description of the package
         * @property {GraphQLID} userId - User Data on package
         * @property {UserType} user - User Data on package
         * @property {GraphQLInt} price - Price of the package
         * @property {GraphQLString} expiresAt - Date and time when this package expires
         * @property {GraphQLString} createdAt - Date and time when this users account was created
         * @property {GraphQLString} updatedAt - Date and time when this users account was last updated
         */
	fields: () => ({
        _id: {
            type: GraphQLID,
            description: 'ID of the package, Generated automatically by MongoDB',
        },
        name: {
            type: GraphQLString,
            description: 'Name of the package',
        },
        description: {
            type: GraphQLString,
            description: 'Description of the package',
        },
        userId:{
            type: GraphQLID,
            description: 'User Data on package'
        },
        user:{
            type: UserType,
            description: 'User Data on package'
        },
        price: {
            type: GraphQLInt,
            description: 'Price of the package',
        },
        expiresAt: {
            type: GraphQLString,
            description: 'Date and time when this package expires',
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

const Package = new GraphQLObjectType({
    name: 'Package',
    description: 'Package type for managing all the packages in our application.',

        /**
         * A package type for managing all the packages in our application.
         *
         * This type has a single field `package` which is of type `PackageType`.
         * The `PackageType` is described in the documentation for the Package type.
         */
    fields: () => ({
        package: {
            type: PackageType,
            description: 'Package type for managing all the packages in our application.',
        }
    })
})

const Packages = new GraphQLObjectType({
	name: 'Packages',
	description: 'Package type for managing all the packages in our application.',


        /**
         * Fields of the Packages type.
         *
         * The `packages` field is an array of `PackageType` objects and contains
         * all the packages in the application.
         */
	fields: () => ({
        packages: {
            type: new GraphQLList(PackageType),
            description: 'List of all the packages',
        },
	})

});





module.exports = {
    Package,
    Packages
};


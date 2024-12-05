const GraphQL = require('graphql');
const {
	GraphQLObjectType,
	GraphQLSchema,
} = GraphQL;


// import the user query file we created
const UserQuery = require('./queries/userQuery');
const AdminQuery = require('./queries/adminQuery');
const PackageQuery = require('./queries/packageQuery');

// import the user mutation file we created
const UserMutation = require('./mutations/userMutation');
const AdminMutation = require('./mutations/adminMutation');
const PackageMutation = require('./mutations/packageMutation');




// lets define our root query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'This is the default root query provided by the backend',
	fields: {
	    // User
		user: UserQuery.getUserQuery(),
		admin: AdminQuery.getAdminQuery(),

		// Admin
		adminProfile: AdminQuery.getAdminQuery(),
		adminUsers: AdminQuery.getAllUsersQuery(),
		adminUser: AdminQuery.getUserQuery(),

		// Package
		package: PackageQuery.getPackageQuery(),
		packages: PackageQuery.getAllUserPackagesQuery(),
		userPackageFilter: PackageQuery.userFilterPackageQuery(),
		adminPackages: PackageQuery.getAdminAllPackagesQuery(),
		adminPackageFilter: PackageQuery.adminFilterPackageQuery(),


	},
});


// lets define our root mutation
const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Default mutation provided by the backend APIs',
	fields: {
	    // User
        loginUser: UserMutation.loginMutation(),
		registerUser: UserMutation.RegisterMutation(),

		// Admin
		loginAdmin: AdminMutation.loginMutation(),
		registerAdmin: AdminMutation.RegisterMutation(),

		// Package
		addPackage: PackageMutation.createPackage(),
		updatePackage: PackageMutation.updatePackage(),
		deletePackage: PackageMutation.deletePackage(),
	},
});



// export the schema
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});


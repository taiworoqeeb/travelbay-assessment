const GraphQL = require("graphql");
const { User, Users } = require("./userType");
const { Package, Packages } = require("./packageType");
const { Admin, Admins } = require("./adminType");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLUnionType,
  isType,
} = GraphQL;

const dataType = new GraphQLUnionType({
  name: "Data",
  types: [
    User,
    Package,
    Admin,
    Users,
    Packages,
    Admins,
  ],

  resolveType(value) {

    if (value.hasOwnProperty("user")) {

      return User.toJSON();
    }

    if (value.hasOwnProperty("package")) {

      return Package.toJSON();
    }

    if (value.hasOwnProperty("admin")) {

      return Admin.toJSON();
    }

    if (value.hasOwnProperty("users")) {
      return Users.toJSON();
    }

    if (value.hasOwnProperty("packages")) {

      return Packages.toJSON();
    }

    if (value.hasOwnProperty("admins")) {
      return Admins.toJSON();
    }
  },
});

// GraphQLUnionType dataType =  UserType | PackageType | new GraphQLList(PackageType)| AdminType | new GraphQLList(AdminType) | new GraphQLList(UserType)

const responseType = new GraphQLObjectType({
  name: "Response",
  description:
    "Response type for managing all the responses in our application.",

  fields: () => ({
    status: {
      type: GraphQLBoolean,
      description: "Status of the response, whether true or false",
    },
    statusCode: {
      type: GraphQLInt,
      description: "Status code of the response",
    },
    message: {
      type: GraphQLString,
      description: "Message of the response",
    },
    data: {
      type: dataType,
      description: "Data of the response",
    },
  }),
});

module.exports = {
  responseType,
};

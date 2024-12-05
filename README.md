# Travelbay-Assessment

This is a basic GraphQL application. It is a simple application that allows you to manage users, packages and responses. It could be best written in Typescript.

## Environment Varibles

- PORT: Application port
- MONGO_URI: Mongodb connection string
- JWT_SECRET: JWT secret
- NODE_ENV: Application environment

## How to Start the Application

- Run `yarn install` or `npm install`
- Run `yarn dev` or `npm run dev` or `yarn start` or `npm run start` to start the application
- Go to `http://localhost:${PORT}/graphql` to view the playground

## Type

### Package Type

- Package
- Packages

### User Type

- User
- Users
- Admin
- Admins

### Response Type

- Status: Boolean
- StatusCode: Number
- Message: String
- Data: Object or Array
  - User
  - Users
  - Package
  - Packages
  - Admin
  - Admins

### Schema Documentation

This can be viewed in the graphql playground.

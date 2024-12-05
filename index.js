const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const {terminate} = require('./utils/error');
const compression = require('compression');
const cors = require('cors');
const {logger, myStream} = require("./utils/logger");
const morgan = require("morgan");
const jwt = require('express-jwt');
const GraphQLSchema = require('./graphql');
const { User } = require("./models/userModel");
const { Admin } = require("./models/adminModel");
require("dotenv").config();

const app = express();
const server = require("http").createServer(app)
app.use(morgan(":remote-addr :method :url :status :res[content-length] - :response-time ms", {stream: myStream} ));

mongoose.set('strictQuery', false);
mongoose.set('strictPopulate', false);
mongoose.connect(process.env.MONGO_URI, {

}).then(() => {
    console.log("Database Connected")
})
.catch(e => console.log(e))


app.use(cors());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/graphql', jwt.expressjwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
    credentialsRequired: false,
    algorithms: ["HS256"]
}));

// =========== GraphQL setting  ========== //
app.use('/graphql', async (req, res, done) => {
        const userId = req.auth && req.auth.userId ? req.auth.userId : undefined
        const adminId = req.auth && req.auth.adminId ? req.auth.adminId : undefined



        if(userId){
            const user = await User.exists({_id: userId})
            if(user){
                req.context = req.auth
            }else{
                return res.status(401).json({
                    status: false,
                    statusCode: 401,
                    message: "Unauthorized",
                    data: {}
                })
            }
        }

        if(adminId){
            const admin = await Admin.exists({_id: adminId})
            if(admin){
                req.context = req.auth
            }else{
                return res.status(401).json({
                    status: false,
                    statusCode: 401,
                    message: "Unauthorized",
                    data: {}
                })
            }
        }

        done();

});
app.use('/graphql', graphqlHTTP(req => ({
        schema: GraphQLSchema,
        context: req.context,
        pretty: true,
        graphiql: process.env.NODE_ENV === 'development' ? {headerEditorEnabled: true} : false,
    })
));
// =========== GraphQL setting END ========== //

app.get('/health', (req, res) => {
    const message = "API is live and healthy in sandbox mode"
    return res.status(200).json({success: true, message})
})

app.use((req, res, next) => {
    return res.status(404).json({ success: false, message: "Resource not found" })
})


const PORT = process.env.PORT || 7500;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//error handlers
const errorHandler = terminate(server, mongoose)
process.on('uncaughtException', errorHandler(1, 'Unexpected Error'))    //programmer error
process.on('unhandledRejection', errorHandler(1, 'Unhandled Promise'))  //unhandled promise error
process.on('SIGTERM', errorHandler(0, 'SIGTERM'))   //on a successful termination
process.on('SIGINT', errorHandler(0, 'SIGINT')) //interrupted process

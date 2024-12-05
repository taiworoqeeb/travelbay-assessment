const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    status: {type: String, enum: ["active", "disabled"],  default: "active"},
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const User = model('User', userSchema, 'users')

module.exports = {
    User
}

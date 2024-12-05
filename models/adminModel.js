const {Schema, model} = require('mongoose');

const adminSchema = new Schema({
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
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Admin = model('Admin', adminSchema, 'admins')

module.exports = {
    Admin
}

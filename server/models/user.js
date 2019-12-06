const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name field is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email field is required']
    },
    password: {
        type: String,
        required: [true, 'The password field is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['USER_ROLE', 'ADMIN_ROLE'],
            message: '{VALUE} is a role invalid'
        }
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})



userSchema.methods.toJSON = function(){
    let user = this.toObject();
    delete user.password;
    return user;
}

mongoose.plugin(uniqueValidator, {message: '{PATH} must be unique'})

module.exports = mongoose.model('User', userSchema)
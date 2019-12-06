const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

mongoose.plugin(uniqueValidator, {message: '{PATH} must be unique'})


module.exports = mongoose.model('Category', categorySchema)
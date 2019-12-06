const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

let productSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Name is required'],
        unique: true
    },
    unitPrice:{
        type: Number,
        required: [true, 'Name is required']
    },
    description:{
        type: String,
        required: false
    },
    img:{
        type: String,
        required: false
    },
    stock:{
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Product', productSchema)
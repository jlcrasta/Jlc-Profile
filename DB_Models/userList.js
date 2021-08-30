const mongoose = require('mongoose')
const { Schema } = mongoose;//this is required to work with other models Schemas

const listSchema = new Schema({
    /* user: [{
         type: Schema.Types.ObjectId,
         ref: 'list'
     }]*/
    user: {
        type: String,
        required: true
    },
    list: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('list', listSchema);
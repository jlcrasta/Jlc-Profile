//const plm = require('passport-local-mongoose')
const mongoose = require('mongoose')
//const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username required']
    },
    password: {
        type: String,
        required: [true, 'password required']
    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: true
    }
})

//userSchema.plugin(plm)

module.exports = mongoose.model('user', userSchema);
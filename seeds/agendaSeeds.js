const mongoose = require('mongoose')
const list = require('../DB_Models/userList')

mongoose.connect('mongodb://localhost:27017/resume_TodoList', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to database resume_ToDoList at port 27017')
    })
    .catch(e => {
        console.log('ERROR occured here it is', e)
    })

list.insertMany([
    { user: 'jack', list: 'Waking Up' },
    { user: 'joy', list: 'sleeping' },
    { user: 'jim', list: 'eating' },
    { user: 'kim', list: 'bathing' },
    { user: 'tom', list: 'dinning' }
]).then(data => {
    console.log(data + 'agendas added successfully')
})
const express = require('express');
const router = express.Router();
const todoListRoute = require('./projectSpecificRoute/todoList')


router.use('/todoList', todoListRoute)

router.get('/', (req, res) => {
    res.render('./HTML_Pages/projectPages/jlcProject.ejs')
})

router.get('/calculator', (req, res) => {
    res.render('./HTML_Pages/projectPages/calculator.ejs')
})

router.get('/cryptoCurrency', (req, res) => {
    res.render('./HTML_Pages/projectPages/cryptocurreny.ejs')
})

router.get('*', (req, res) => {
    res.status(404)
    res.render('./HTML_Pages/projectPages/noSuchProject.ejs')
})

module.exports = router
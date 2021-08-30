const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('./HTML_Pages/jlcHome.ejs')
})

router.get('/skills', (req, res) => {
    res.render('./HTML_Pages/jlcSkills.ejs')
})

router.get('/about', (req, res) => {
    res.render('./HTML_Pages/jlcAbout.ejs')
})

router.get('/contact', (req, res) => {
    res.render('./HTML_Pages/jlcContact.ejs')
})

router.get('*', (req, res) => {
    res.status(404)
    res.render("./HTML_Pages/pageNotFound.ejs")
})

module.exports = router
if (process.env.NODE_ENV !== "production") {//this is used to access .env file when we are in development mode
    require('dotenv').config();
}


const port = process.env.PORT || 5000
const express = require('express');
const app = express();
const path = require('path')
const contentRoute = require('./Routes/contentRouter')
const projectRoute = require('./Routes/projectsRouter')
const ejs = require('ejs')
const mongoSanitize = require('express-mongo-sanitize')//this is used to get security for Mongo SQL Injection

const helmet = require('helmet')//here another layer is added for security
app.use(helmet());

const scriptSrcUrls = [//these codes needs to be checked
    'https://smtpjs.com/v3/smtp.js',
    'https://api.cryptonator.com/api/ticker/eth-usd',
    'https://api.cryptonator.com/api/ticker/btc-usd',
    'https://api.cryptonator.com/api/ticker/bnb-usd',
    'https://api.cryptonator.com/api/ticker/usdt-usd',
    'https://api.cryptonator.com/api/ticker/ltc-usd',
];
const styleSrcUrls = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",
];
const connectSrcUrls = [
    'https://smtpjs.com',
    'https://api.cryptonator.com',
];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com"]
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
            ],
            fontSrc: ["'self'", "'unsafe-inline'", ...fontSrcUrls],
        },
    })
);


app.use(mongoSanitize())
app.set('view engine', ejs)
app.set('views', path.join(__dirname, '/views'))

app.use(express.static(path.join(__dirname, '/public')))


app.use('/project', projectRoute)
app.use('/', contentRoute)


app.use((err, req, res, next) => {
    const { status = 500, message = 'something went worng' } = err;
    res.status(status).send(message)
})

app.listen(port, () => {
    console.log(`listening on port ${port} for www.jlcrasta.com`)
})

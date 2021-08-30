

const express = require('express');
const router = express.Router();
const User = require('../../DB_Models/userModel')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')//used for cookie
const List = require('../../DB_Models/userList')
const methodover = require('method-override')
const todoListError = require('./utilities/todoListError')
const asyncError = require('./utilities/asyncError')
const handleCastError = require('./utilities/handleCastError')
const createOneSchema = require('./utilities/createOneSchema')
const listSchema = require('./utilities/listSchema')
const session = require('express-session')
const mongodbsession = require('connect-mongodb-session')(session);
const flash = require('connect-flash')
const bcrypt = require('bcrypt')
//const DbUrl = process.env.DB_URL;

router.use(flash())
router.use(methodover('_method'))
router.use(cookieParser())
router.use(express.urlencoded({ extended: true }))

const validateCreateOne = (req, res, next) => {
    const { error } = createOneSchema.validate(req.body);
    if (error) {
        const mes = error.details.map(el => el.message).join(',')
        if (process.env.NODE_ENV !== "production") {
            throw new todoListError(mes, 400)
        } else {
            req.flash('error', mes)
        }
    }
    else {
        next()
    }
}

const validateList = (req, res, next) => {
    const { error } = listSchema.validate(req.body);
    if (error) {
        const mes = error.details.map(el => el.message).join(',')
        if (process.env.NODE_ENV !== "production") {
            throw new todoListError(mes, 400)
        }
        else {
            req.flash('error', mes)
        }
    }
    else {
        next()
    }
}

const mongoURI = process.env.DBURL || 'mongodb://localhost:27017/resume_TodoList';
const secret = process.env.SECRET || 'confidential';

//console.log(process.env.DB_URL)

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('connected to database resume_ToDoList at port 27017')
    })
    .catch(e => {
        console.log('ERROR occured here it is', e)
    })

const sessionStore = new mongodbsession({//here session variable is created to store in DB
    url: mongoURI,
    touchAfter: 24 * 60 * 60,
    collection: 'sessions'
})

sessionStore.on("error", function (e) {
    console.log("session error occured", e)
})

router.use(session({//here session is created and made available in every route
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

router.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    } else {
        req.flash('error', "Please Login")
        res.redirect('getOne')
    }
}

router.get('/', (req, res) => {
    res.render('./HTML_Pages/projectPages/todoList/todoList.ejs')
})


router.get('/createOne', (req, res) => {//Registration Page
    res.render('./HTML_Pages/projectPages/todoList/createOne.ejs')
})
router.post('/createOne', validateCreateOne, asyncError(async (req, res) => {//here the user is created
    const { username, password, email } = req.body
    if (req.body == null) {
        req.flash('error', "Please Provide right credentials")
        return res.redirect('/project/todoList/createOne')
    }
    const userEmail = await User.findOne({ email });
    const userName = await User.findOne({ username });
    if (userName || userEmail) {
        req.flash('error', "User existes with provided Username or Email")
        res.redirect('createOne')
    } else {
        const hashedPwd = await bcrypt.hash(password, 12)
        const user = new User({
            username,
            password: hashedPwd,
            email
        });
        await user.save();
        req.flash('success', "Registerd Successfully Please Login")
        res.redirect('getOne')
    }
}))


router.get('/getOne', (req, res) => {//user login page
    res.render('./HTML_Pages/projectPages/todoList/getOne.ejs', { message: req.flash('login') })
})
router.post('/getOne', asyncError(async (req, res) => {//new user is logged in
    const { username, password } = req.body;
    const user = await User.findOne({ username: username })
    if (user == null) {
        req.flash('error', "No Such User!!!")
        return res.redirect('/project/todoList/getOne')
    }
    const isUser = await bcrypt.compare(password, user.password);
    if (isUser == true) {
        req.session.isAuth = true;
        res.cookie('user', username, { expires: new Date(Date.now() + 500000) })
        res.redirect('/project/todoList/allToDoList')
    }
    else {
        req.flash('error', "Worng Credentials")
        return res.redirect('/project/todoList/getOne')
    }
}))

router.get('/allToDoList', isAuth, asyncError(async (req, res) => {
    const username = req.cookies.user;
    const user = await User.findOne({ username: username })
    const lists = await List.find({ user: user._id })
    res.render('./HTML_Pages/projectPages/todoList/allToDoList.ejs', { lists, username, message: req.flash('deletedMsg') })
}))

router.get('/addList', isAuth, asyncError(async (req, res) => {//here the user list page is loaded
    const username = req.cookies.user;
    res.render('./HTML_Pages/projectPages/todoList/addToDoList.ejs', { username })
}))
router.post('/addList', validateList, isAuth, asyncError(async (req, res) => {//here agenda is saved
    const { agenda } = req.body
    const username = req.cookies.user;
    const user = await User.findOne({ username })
    const newList = new List({ list: agenda, user: user._id })
    newList.save();
    res.redirect('/project/todoList/allToDoList')
}))

router.get('/editToDoList/:id', isAuth, asyncError(async (req, res) => {
    const { id } = req.params
    const username = req.cookies.user;
    const findComment = await List.findOne({ _id: id })
    const list = findComment.list
    res.render('./HTML_Pages/projectPages/todoList/editToDoList.ejs', { username, list, id })
}))
router.patch('/editToDoList/:id', isAuth, asyncError(async (req, res) => {//here the user list is edited
    const { id } = req.params;
    await List.findOneAndUpdate({ _id: id }, { list: req.body.editedList })
    res.redirect('/project/todoList/allToDoList')
}))

router.delete('/deleteToDoList/:id', isAuth, asyncError(async (req, res) => {//here the user list is deleted
    const { id } = req.params;
    await List.findOneAndDelete({ _id: id })
    req.flash('success', 'List Deleted Successfully')
    res.redirect('/project/todoList/allToDoList')
}))

router.post('/logout', (req, res) => {//user is logged Out
    req.session.destroy((err) => {
        if (err) throw err
        else
            res.redirect('/project/todoList/getOne')
    })
})

router.get('/forgotPassword', (req, res) => {
    res.render('./HTML_Pages/projectPages/todoList/forgotPassword.ejs')
})

router.post('/forgotPassword', asyncError(async (req, res) => {
    const { forgotName } = req.body;
    const user = await User.findOne({ email: forgotName })

    if (user) {
        res.render('./HTML_Pages/projectPages/todoList/passwordSetup.ejs', { user })
    } else
        req.flash('error', "No Such User!!!")
    res.redirect('/project/todoList/getOne')
}))

router.post('/newPassword/:id', asyncError(async (req, res) => {
    const name = req.params
    const { newPass } = req.body
    const hashedPwd = await bcrypt.hash(newPass, 12)
    await User.findOneAndUpdate({ username: name.id }, { password: hashedPwd })
    req.flash('success', "Password Reset Successful")
    res.redirect('/project/todoList/getOne');
}))

router.get('/deleteAccount', (req, res) => {//delete Account page is loaded
    res.render('./HTML_Pages/projectPages/todoList/deleteAccount.ejs')
})

router.delete('/deleteAccount', asyncError(async (req, res) => {//here Account with list are deleted
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {
        const isUser = await bcrypt.compare(password, user.password)
        if (isUser) {
            await User.findOneAndDelete({ _id: user.id })
            await List.deleteMany({ user: user._id })
            req.flash('success', "Account Deleted Successfully!")
            res.redirect('/project/todoList')
        }
        else {
            req.flash('error', "No Such Account Found!");
            res.redirect('/project/todoList/getOne')
        }
    }
    else {
        req.flash('error', "No Such User Found!");
        res.redirect('/project/todoList/getOne')
    }

}))

router.use((err, req, res, next) => {//here cast error is checked if any
    if (err.name === 'CastError')
        if (process.env.NODE_ENV !== "production") {
            return res.render('./HTML_Pages/projectPages/todoList/errorPage.ejs')
        } else
            err = handleCastError(err) //for development must be changed
    next(err);
})

router.use((req, res) => {
    if (process.env.NODE_ENV !== "production") {
        return res.render('./HTML_Pages/projectPages/todoList/errorPage.ejs')
    }//use of return is must else node will throw an error
    else
        res.status(404).send('no such url!!')
})

module.exports = router
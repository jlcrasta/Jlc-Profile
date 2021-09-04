const todoListError = require('./todoListError')
const handleCastError = err => {

    if (process.env.NODE_ENV !== "production") {
        return req.flash('error', "Error had Occured !!! Please check the credentials or url")

    } else
        return new todoListError(`Worng URL provided...${err.message}`, 400)
}
module.exports = handleCastError;
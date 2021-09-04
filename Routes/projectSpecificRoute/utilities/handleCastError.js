const todoListError = require('./todoListError')
const handleCastError = err => {

    return new todoListError(`Worng URL provided...${err.message}`, 400)
}
module.exports = handleCastError;
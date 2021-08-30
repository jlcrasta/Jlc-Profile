const Joi = require('joi')

module.exports = Joi.object({
    agenda: Joi.string()
        .required()
})
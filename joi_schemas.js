const Joi = require("joi");

module.exports.saunaSchema = Joi.object({
    sauna: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});
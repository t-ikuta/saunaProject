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

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});
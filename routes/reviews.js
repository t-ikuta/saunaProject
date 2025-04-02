const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../convenient/catchAsync");
const { reviewSchema } = require("../joi_schemas");
const ExpressError = require("../convenient/ExpressError");
const Sauna = require("../models/sauna");
const Review = require("../models/review");

// Joiを使ったバリデーションミドルウェア
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// レビュー作成
router.post("/", validateReview, catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id);
    const review = new Review(req.body.review);
    sauna.reviews.push(review);
    await review.save();
    await sauna.save();
    req.flash('success', 'レビューを投稿しました！');
    res.redirect(`/saunas/${sauna._id}`);
}));

// レビュー削除
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Sauna.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'レビューを削除しました');
    res.redirect(`/saunas/${id}`);
}));

module.exports = router;

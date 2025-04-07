const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../convenient/catchAsync");
const Sauna = require("../models/sauna");
const Review = require("../models/review");
const { validationReview, logined, reviewAuthorValidation } = require("../middleware");

// レビュー作成
router.post("/", logined, validationReview, catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    sauna.reviews.push(review);
    await review.save();
    await sauna.save();
    req.flash('success', 'レビューを投稿しました！');
    res.redirect(`/saunas/${sauna._id}`);
}));

// レビュー削除
router.delete("/:reviewId",  logined, reviewAuthorValidation, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Sauna.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'レビューを削除しました');
    res.redirect(`/saunas/${id}`);
}));

module.exports = router;

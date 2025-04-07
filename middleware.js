const ExpressError = require('./convenient/ExpressError');
const Sauna = require('./models/sauna');
const Review = require('./models/review');
const {saunaSchema, reviewSchema} = require('./joi_schemas');

// ログイン状態を確認
module.exports.logined = (req, res, next) => {
    if(!req.isAuthenticated()){
        // 元々いたurlを保存
        req.session.returnUrl = req.originalUrl;
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
}

// req.session.returnUrlはセッションの途中でurlが破棄されるので、それをres.locals.へ保存しておく
module.exports.moveReturnUrl = (req, res, next) => {
    if(req.session.returnUrl){
        res.locals.returnUrl = req.session.returnUrl;
    }
    next();
}

// ユーザー権限の確認
module.exports.authorValidation = async (req, res, next) => {
    const { id } = req.params;
        const saunaUser = await Sauna.findById(id);
        if(!saunaUser.author.equals(req.user._id)){
            req.flash('error', '操作する権限はありません');
            return res.redirect(`/saunas/${saunaUser._id}`);
        }
    next();
}

// レビューユーザー権限の確認
module.exports.reviewAuthorValidation = async (req, res, next) => {
    const { id, reviewId } = req.params;
        const reviewUser = await Review.findById(reviewId);
        if(!reviewUser.author.equals(req.user._id)){
            req.flash('error', '操作する権限はありません');
            return res.redirect(`/saunas/${id}`);
        }
    next();
}

// Joiを使用したバリデーションミドルウェア
module.exports.validationSauna = (req, res, next) => {
    const { error } = saunaSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validationReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
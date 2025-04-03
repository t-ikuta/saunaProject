const express = require('express');
const router = express.Router();
const catchAsync = require("../convenient/catchAsync");
const { saunaSchema } = require("../joi_schemas");
const ExpressError = require("../convenient/ExpressError");
const Sauna = require("../models/sauna");
const {logined} = require("../middleware");

// Joiを使用したバリデーションミドルウェア
const validationSauna = (req, res, next) => {
    const { error } = saunaSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// 一覧表示
router.get("/", catchAsync(async (req, res) => {
    const saunas = await Sauna.find({});
    res.render("saunas/index", { saunas });
}));

// 新規作成フォーム
router.get("/new", logined, (req, res) => {
    res.render("saunas/new");
});

// 新規登録
router.post("/", logined, validationSauna, catchAsync(async (req, res) => {
    const sauna = new Sauna(req.body.sauna);
    await sauna.save();
    req.flash('success', '新しいサウナを登録しました！');
    res.redirect(`/saunas/${sauna._id}`);
}));

// 詳細表示
router.get("/:id", catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id).populate('reviews');
    if (!sauna) {
        req.flash('error', 'サウナが見つかりません');
        return res.redirect("/saunas");
    }
    res.render("saunas/detail", { sauna });
}));

// 編集フォーム
router.get("/:id/edit", logined, catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id);
    if (!sauna) {
        req.flash('error', 'サウナが見つかりませんでした');
        return res.redirect("/saunas");
    }
    res.render("saunas/edit", { sauna });
}));

// 更新
router.put("/:id", logined, validationSauna, catchAsync(async (req, res) => {
    const { id } = req.params;
    const sauna = await Sauna.findByIdAndUpdate(id, { ...req.body.sauna });
    req.flash('success', '施設情報を更新しました');
    res.redirect(`/saunas/${sauna._id}`);
}));

// 削除
router.delete("/:id", logined, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Sauna.findByIdAndDelete(id);
    req.flash('success', '施設を削除しました');
    res.redirect("/saunas");
}));

module.exports = router;

const express = require('express');
const router = express.Router();
const catchAsync = require("../convenient/catchAsync");
const { saunaSchema } = require("../joi_schemas");
const ExpressError = require("../convenient/ExpressError");
const Sauna = require("../models/sauna");
const {logined, authorValidation, validationSauna} = require("../middleware");

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
    // ユーザーIDを登録
    sauna.author = req.user._id; 
    await sauna.save();
    req.flash('success', '新しいサウナを登録しました！');
    res.redirect(`/saunas/${sauna._id}`);
}));

// 詳細表示
router.get("/:id", catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("author");
    console.log(sauna);
    if (!sauna) {
        req.flash('error', 'サウナが見つかりません');
        return res.redirect("/saunas");
    }
    res.render("saunas/detail", { sauna });
}));

// 編集フォーム
router.get("/:id/edit", logined, authorValidation, catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id);
    if (!sauna) {
        req.flash('error', 'サウナが見つかりませんでした');
        return res.redirect("/saunas");
    }
    res.render("saunas/edit", { sauna });
}));

// 更新
router.put("/:id", logined, authorValidation, validationSauna, catchAsync(async (req, res) => {
    const { id } = req.params;
    const sauna = await Sauna.findByIdAndUpdate(id, { ...req.body.sauna });
    req.flash('success', '施設情報を更新しました');
    res.redirect(`/saunas/${sauna._id}`);
}));

// 削除
router.delete("/:id", logined, authorValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Sauna.findByIdAndDelete(id);
    req.flash('success', '施設を削除しました');
    res.redirect("/saunas");
}));

module.exports = router;

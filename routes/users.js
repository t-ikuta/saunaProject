const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const {moveReturnUrl} = require("../middleware");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res, next) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const newUser = await User.register(user, password);
        // 登録後自動でログイン
        req.logIn(newUser, (e) => {
            if(e) return next(e);
            req.flash("success", "saunaProjectへようこそ");
            res.redirect("/saunas");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

// passport.authenticate()でログイン認証を行うミドルウェアで、オプションとしてエラーメッセージとリダイレクト先を指定
router.post("/login", moveReturnUrl, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    const redirectUrl = res.locals.returnUrl || "/saunas";
    delete req.session.returnUrl;
    req.flash("success", "ログインしました");
    res.redirect(redirectUrl);
});

router.post("/logout", (req, res, next) => {
    req.logout((e) => {
        if(e){return next(e);}
    });
    req.flash("success", "ログアウトしました。");
    res.redirect("/saunas");
});

module.exports = router;

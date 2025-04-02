const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        await User.register(user, password);
        req.flash("success", "saunaProjectへようこそ");
        res.redirect("/saunas");    
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

// passport.authenticate()でログイン認証を行うミドルウェアで、オプションとしてエラーメッセージとリダイレクト先を指定
router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), async (req, res) => {
    req.flash("success", "ログインしました");
    res.redirect("/saunas");
})

module.exports = router;

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
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require('morgan');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const ExpressError = require("./convenient/ExpressError");
const saunaRoutes = require('./routes/saunas');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require("./routes/users");

const app = express();

// ミドルウェアの設定
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// app.use(morgan('tiny'));
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDBの接続
mongoose.connect("mongodb://localhost:27017/saunaProject")
    .then(() => {
        console.log("MongoDBコネクションOK");
    })
    .catch((e) => {
        console.log(`コネクションエラー：${e}`);
    });

// セッションの設定
app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}));

// パスポートの設定
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// フラッシュメッセージの設定
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.send("ホーム");
});

// 静的ファイルの提供
// app.use(express.static(path.join(__dirname, "public")));
// ルーティングの定義
app.use('/saunas', saunaRoutes);
app.use('/saunas/:id/reviews', reviewRoutes);
app.use("/", userRoutes);

// エラーハンドリング
app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりませんでした", 404));
});


app.use((err, req, res, next) => {
    if(!err.message) err.message = "問題が起きました";
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error", {err});
});

app.listen(3000, () => {
    console.log("ポート3000でリクエスト待受中...");
});
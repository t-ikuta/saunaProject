const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require('morgan');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./convenient/ExpressError");

const saunaRoutes = require('./routes/saunas');
const reviewRoutes = require('./routes/reviews');

const app = express();

// ミドルウェアの設定
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(morgan('tiny'));
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

app.get("/", (req, res) => {
    res.send("ホーム");
});

// 静的ファイルの提供
// app.use(express.static(path.join(__dirname, "public")));
// ルーティングの設定
app.use('/saunas', saunaRoutes);
app.use('/saunas/:id/reviews', reviewRoutes);

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
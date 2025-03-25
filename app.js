const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require('morgan');
const ejsMate = require("ejs-mate");
const Sauna = require("./models/sauna");
const catchAsync = require("./convenient/catchAsync");
const ExpressError = require("./convenient/ExpressError");
const {saunaSchema} = require("./joi_schemas");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(morgan('tiny'));
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/saunaProject")
    .then(() => {
        console.log("MongoDBコネクションOK");
    })
    .catch((e) => {
        console.log(`コネクションエラー：${e}`);
    });

// Joiを使用したサーバーサイドのバリデーションチェック関数
const validationSauna = (req, res, next) => {
    const {error} = saunaSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(detail => detail.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

app.get("/", (req, res) => {
    res.send("ホーム");
});

app.get("/saunas", catchAsync(async(req, res) => {
    const saunas = await Sauna.find({});
    console.log(saunas);
    res.render("saunas/index", {saunas}); 
}));

app.get("/saunas/new", (req, res) => {
    res.render("saunas/new");
});

// 新規登録
app.post("/saunas", validationSauna, catchAsync( async (req, res) => {
    const sauna = new Sauna(req.body.sauna);
    await sauna.save();
    res.redirect(`/saunas/${sauna._id}`);
}));

// 詳細
app.get("/saunas/:id", catchAsync(async(req, res) => {
    const sauna = await Sauna.findById(req.params.id);
    res.render("saunas/detail", {sauna});
}));

// 編集ページへ
app.get("/saunas/:id/edit", catchAsync(async (req, res) => {
    const sauna = await Sauna.findById(req.params.id);
    res.render("saunas/edit", {sauna});
}));

// 更新
app.put("/saunas/:id", validationSauna, catchAsync(async (req, res) => {
    const {id} = req.params;
    const sauna = await Sauna.findByIdAndUpdate(id, {...req.body.sauna});
    console.log(sauna);
    res.redirect(`/saunas/${sauna._id}`);
}));

// 削除
app.delete("/saunas/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    await Sauna.findByIdAndDelete(id);
    res.redirect("/saunas");
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりませんでした", 404));
});

// エラーオブジェクト
app.use((err, req, res, next) => {
    if(!err.message){
        err.message = "問題が起きました"
    }
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error", {err});
});

app.listen(3000, () => {
    console.log("ポート3000でリクエスト待受中...");
});
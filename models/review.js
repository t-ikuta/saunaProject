const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,   //コメント
    rating: Number,   //評価
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"   //ユーザーのIDを参照
    },    //投稿者
    createdAt: {       //投稿日時
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Review", reviewSchema);
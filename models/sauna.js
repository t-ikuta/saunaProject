const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

// スキーマの定義
const saunaSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    // サウナ施設登録したユーザーの情報を追加
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [   // レビューへの参照を配列として追加
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

saunaSchema.post("findOneAndDelete", async function(doc){
    if(doc){
        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
});

// コレクションの定義
module.exports = mongoose.model("Sauna", saunaSchema);
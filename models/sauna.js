const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// スキーマの定義
const saunaSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});
// コレクションの定義
module.exports = mongoose.model("Sauna", saunaSchema);
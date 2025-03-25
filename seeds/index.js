// テストデータ
const mongoose = require("mongoose");
const Sauna = require("../models/sauna");
const cities = require("./cities");
const {descriptors, places} = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/saunaProject", {useNewUrlParser: true,useUnifiedTopology: true})
    .then(() => {
        console.log("MongoDBコネクションOK");
    })
    .catch((e) => {
        console.log(`コネクションエラー：${e}`);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    // 今あるデータを削除
    await Sauna.deleteMany({});
    // 50個分/citiesからのデータをデータベースに登録
    for (let i = 0; i < 5; i++){
        const randumCityIndex = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 2000) + 1000;
        const sauna = new Sauna({
            location: `${cities[randumCityIndex].prefecture}${cities[randumCityIndex].city}`,
            title: `${cities[randumCityIndex].facilityName}`,
            // image: "https://picsum.photos/400?random=${Math.random()}",
            description: "この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れ",
            price: `${cities[randumCityIndex].price}`,
            image: "https://picsum.photos/200/300"
        });
        await sauna.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
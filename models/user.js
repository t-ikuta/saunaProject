const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});

// passportLocalMongooseの機能がuserSchemaに追加される
userSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UserExistsError: "そのユーザー名はすでに使われています",
        MissingPasswordError: "パスワードが必要です",
        AttemptTooSoonError: "アカウントがロックされています。しばらくしてから再度お試しください",
        TooManyAttemptsError: "ログインの失敗が続いたため、アカウントがロックしました。",
        NoSaltValueStoredError: "認証に失敗しました。",
        IncorrectPasswordError: "パスワードまたはユーザー名が間違っています",
        IncorrectUsernameError: "パスワードまたはユーザー名が間違っています",
}});

module.exports = mongoose.model("User", userSchema);
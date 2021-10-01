const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model("User", UserSchema)
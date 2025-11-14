const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/MiniProject`);

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    profilePicture :{
        type: String,
        default: 'default.jpg'
    }
})

module.exports = mongoose.model('user', userSchema);
const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const schemaSauce = mongoose.Schema({
    _id: { type: String },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    usersLiked: [{ type: String }],
    usersDisliked: [{ type: String }],
    likes: { type: Number },
    dislikes: { type: Number }
});

module.exports = mongoose.model('Sauce', schemaSauce);
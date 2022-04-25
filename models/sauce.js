const mongoose = require("mongoose");

const schemaSauce = mongoose.Schema({
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: String, require: true },



});
module.exports = mongoose.model("Sauce", schemaSauce);
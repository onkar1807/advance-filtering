const mongoose = require('mongoose');

const botcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    rating: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Bootcamp", botcampSchema);
const mongoose = require("mongoose")

const reviewsSchema = new mongoose.Schema({
    item_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    owner_id: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        required:true
    }

    
}, {timestamps: true});

module.exports = mongoose.model('reviewSchema',reviewsSchema)
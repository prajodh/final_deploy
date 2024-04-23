const mongoose = require("mongoose")

const rentSchema = new mongoose.Schema({
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
    rent_duration: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    
}, {timestamps: true});

module.exports = mongoose.model('rentItems',rentSchema)
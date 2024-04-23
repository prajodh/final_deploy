const mongoose = require("mongoose")

const listingSchema = new mongoose.Schema({
    carMake: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    transmission: {
        type: String,
        enum: ['Manual', 'Automatic'],
        required: true
    },
    fuelType: {
        type: String,
        enum: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    availableFrom: {
        type: Date,
        required: true
    },
    availableTo: {
        type: Date,
        required: true
    },
    location: {
        lat:{
        type: Number,
        required: true
        } ,
        lng:{
        type: Number,
        required: true
        } 

    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rentStatus:{
        type: Boolean,
        default: false

    },
    adminAuth:{
        type: Boolean,
        default: false

    },
    image_url:{
        type: Array,
    }
}, {timestamps: true});

module.exports = mongoose.model('CarListings',listingSchema)
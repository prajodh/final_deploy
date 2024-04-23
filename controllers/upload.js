// const carListings = require("../models/carListings")
const {StatusCodes} = require("http-status-codes")
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const uploadImage =  async (req, res) => {
    const files = req.files
    const urls = []
    for (let key in files) {
            value = files[key];
            console.log(key, value);
            const result = await cloudinary.uploader.upload(value.tempFilePath,
                {use_filename:true, folder:'car_images'})
            urls.push(result.secure_url)
            fs.unlinkSync(value.tempFilePath)
    }
    
    res.status(StatusCodes.OK).json({message:"image uploaded", data:{urls}, status_code:StatusCodes.OK})  
}


module.exports = {uploadImage}
const express = require("express")
const router = express.Router()

const {uploadImage} = require("../controllers/upload")
router.post("/uploadImage", uploadImage)


module.exports = router
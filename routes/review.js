const express = require("express")
const router = express.Router()


const {createReview, getAllItemReviews, getItemRatingDetails}  = require("../controllers/review")

router.post("/createReview", createReview)
router.get("/getallCarReviews/:id", getAllItemReviews)
router.get("/getallCarRatings/:id", getItemRatingDetails)


module.exports = router
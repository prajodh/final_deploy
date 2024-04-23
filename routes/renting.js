const express = require("express")
const router = express.Router()


const {rentItem, stripePayment, sendPaymentEmail,mostRentedItems, mostRentedItemsForUser,itemRentedByUser} = require("../controllers/renting")
router.post("/rentItem", rentItem)
router.post("/stripePayment", stripePayment)
router.post("/sendPaymentEmail", sendPaymentEmail)
router.get("/mostRentedItem", mostRentedItems)
router.get("/mostRentedItemsForUser", mostRentedItemsForUser)
router.get("/itemRentedByUser", itemRentedByUser)


module.exports = router
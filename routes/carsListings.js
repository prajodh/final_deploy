const {getAllCars, getAllOwnerCarsListings, createCar, getSingleCar, updateCar, deleteCar, getAllCarsAdmin, updateAdminApprove, searchCars, filterCars} = require("../controllers/carsListings")
const express = require("express")
const router = express.Router()
const authenticateUser = require("../middleware/authentication")


router.get("/getAllCarsListings",getAllCars)

router.get("/getAllOwnerCarsListings", authenticateUser, getAllOwnerCarsListings)

router.get("/searchCars",authenticateUser, searchCars)

router.get("/filterCars", authenticateUser, filterCars)

router.post("/createCarListings",authenticateUser, createCar)

router.get("/getSingleCarListings/:id",authenticateUser,getSingleCar)

router.patch("/updateCarListings/:id",authenticateUser, updateCar)

router.delete("/deleteCarListings/:id",authenticateUser, deleteCar)

router.get("/getAllCarsListingsAdmin",authenticateUser, getAllCarsAdmin)

router.patch("/adminApprove/:id",authenticateUser, updateAdminApprove)


module.exports = router
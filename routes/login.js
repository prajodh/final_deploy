const express = require("express")
const router = express.Router()

const {register, login, forgetPassword, resetPassword, authenticateQuestions, google, signOut, deleteUserForTest} = require("../controllers/login")
router.post("/register",register)
router.post("/login",login)
router.post("/authenticateQuestions", authenticateQuestions)
router.post("/forgotPassword",forgetPassword)
router.post("/resetPassword",resetPassword)
router.post("/google",google)
router.get("/signout",signOut)
router.delete("/deleteUserForTest", deleteUserForTest)

module.exports = router
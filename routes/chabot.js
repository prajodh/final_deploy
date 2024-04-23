const express = require("express")
const router = express.Router()

const {chatbot, chatbot_2} = require('../controllers/chatbot')

router.post("/chatbot",chatbot_2)

module.exports = router
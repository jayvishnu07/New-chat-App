const express = require("express");
const {
    allMessages,
    sendMessage,
} = require("../Controllers/MessageController");
const authorization = require('../config/middleware/authorization');

const router = express.Router();

router.route("/:chatId").get(authorization, allMessages);
router.route("/").post(authorization, sendMessage);

module.exports = router;

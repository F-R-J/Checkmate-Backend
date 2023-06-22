const express = require("express");
const authcontroller = require("../controllers/authjoinpage");
const authsocketServer = require("../controllers/socketServer.js");
const router = express.Router();

router.post("/joinpage", authcontroller.joinpage);

module.exports = router;

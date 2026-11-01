const express = require("express");

const router = express.Router();

const { searchRepository } = require("../controllers/search.controller");

router.post("/", searchRepository);

module.exports = router;
const express = require("express");
const router = express.Router();

const cutoffs = require("../../data/cutoffs-all.json");

router.get("/", (req, res) => {
  res.json(cutoffs);
});

module.exports = router;
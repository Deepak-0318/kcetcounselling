const express = require("express");
const router = express.Router();

const cutoffs = require("../../data/cutoffs-all.json");

router.get("/", (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;

  if (limit <= 0 || page <= 0) {
    return res.status(400).json({ message: "Invalid page or limit parameter" });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginated = cutoffs.slice(startIndex, endIndex);

  res.json({
    total: cutoffs.length,
    page,
    limit,
    results: paginated
  });
});

module.exports = router;
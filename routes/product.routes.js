const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  res.send({
    message: "Product API",
    success: true,
  });
});

module.exports = router;

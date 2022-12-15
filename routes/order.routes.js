const express = require("express");
const router = new express.Router();

router.get("/", async (req, res) => {
  res.send({
    message: "Order API",
    success: true,
  });
});

module.exports = router;
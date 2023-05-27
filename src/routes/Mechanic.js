const express = require("express");
const router = express.Router();

router.post("/testar", (req, res) => {
  res.json({message: "testando"})
});

module.exports = router;

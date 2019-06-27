const { Router } = require("express");
const elevania = require("../controllers/elevania");

const router = Router();

router.get("/elevania", elevania.index);
// router.get("/elevania/category", elevania.category);

module.exports = router;

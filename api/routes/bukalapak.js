const { Router } = require("express");
const bukalapak = require("../controllers/bukalapak");

const router = Router();

router.get("/bukalapak", bukalapak.index);
router.get("/bukalapak/category", bukalapak.category);

module.exports = router;

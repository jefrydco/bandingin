const { Router } = require("express");
const jdid = require("../controllers/jdid");

const router = Router();

router.get("/jdid", jdid.index);
// router.get("/jdid/category", jdid.category);

module.exports = router;

const { Router } = require("express");
const tokopedia = require("../controllers/tokopedia");

const router = Router();

router.get("/tokopedia", tokopedia.index);

module.exports = router;

const { Router } = require("express");
const products = require("../controllers/products");

const router = Router();

router.get("/products", products.index);
router.get("/products/:id", products.show);
router.post("/products", products.store);
router.put("/products/:id", products.update);
router.delete("/products/:id", products.remove);

module.exports = router;

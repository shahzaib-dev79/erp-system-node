const express = require("express");

const {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} = require("../../controllers/accounting/saleController");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.post("/", createSale);
router.get("/", getAllSales);
router.get("/:id", getSaleById);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

module.exports = router;

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

router.post("/createSales", createSale);
router.get("/getAllSales", getAllSales);
router.get("/getSingleSale/:id", getSaleById);
router.put("/updateSale/:id", updateSale);
router.delete("/deleteSale/:id", deleteSale);

module.exports = router;

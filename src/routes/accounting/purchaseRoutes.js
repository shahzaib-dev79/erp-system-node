const express = require("express");

const {
  createPurchase,
  getAllPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
} = require("../../controllers/accounting/purchaseController");
const authenticate = require("../../middlewares/authenticate");
const { authorize } = require("../../middlewares/authorize");
const purchaseRouter = express.Router();

purchaseRouter.use(authenticate);

purchaseRouter.post("/", authorize("admin", "moderator"), createPurchase);
purchaseRouter.get("/", getAllPurchases);
purchaseRouter.get("/:id", getSinglePurchase);
purchaseRouter.put("/:id", authorize("admin", "moderator"), updatePurchase);
purchaseRouter.delete("/:id", authorize("admin"), deletePurchase);

module.exports = purchaseRouter;

const express = require("express");
const router = express.Router();

const {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} = require("../../controllers/generalLedger/assetController");

const authenticate = require("../../middlewares/authenticate");
const { authorize } = require("../../middlewares/authorize");

router.use(authenticate);

router.post("/", authorize("admin", "moderator"), createAsset);
router.get("/", getAllAssets);
router.get("/:id", getAssetById);
router.put("/:id", authorize("admin", "moderator"), updateAsset);
router.delete("/:id", authorize("admin"), deleteAsset);

module.exports = router;

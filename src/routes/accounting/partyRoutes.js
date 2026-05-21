const express = require("express");

const {
  createParty,
  getAllParties,
  getSingleParty,
  updateParty,
  deleteParty,
} = require("../../controllers/accounting/partyControllers");

const authenticate = require("../../middlewares/authenticate");
const { authorize } = require("../../middlewares/authorize");

const partyRouter = express.Router();

partyRouter.use(authenticate);

partyRouter.post("/", authorize("admin", "moderator"), createParty);

partyRouter.get("/", getAllParties);

partyRouter.get("/:id", getSingleParty);

partyRouter.put("/:id", authorize("admin", "moderator"), updateParty);

partyRouter.delete("/:id", authorize("admin"), deleteParty);

module.exports = partyRouter;

const express = require("express");
const route = express.Router();

const {
  createParty,
  getAllParties,
  getSingleParty,
  updateParty,
  deleteParty,
} = require("../../controllers/accounting/partyControllers");

route.post("/", createParty);
route.get("/", getAllParties);
route.get("/:id", getSingleParty);
route.patch("/:id", updateParty);
route.delete("/:id", deleteParty);

module.exports = route;

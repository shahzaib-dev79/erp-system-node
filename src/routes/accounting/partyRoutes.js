const express = require("express");
const route = express.Router();
const {
	createParty,
	getAllParties,
	getSingleParty,
	updateParty,
	deleteParty,
} = require("../../controllers/accounting/partyControllers");

route.post("/");
route.get("/");
route.get("/:id");
route.patch("/:id");
route.delete("/:id");

module.exports = rotue;

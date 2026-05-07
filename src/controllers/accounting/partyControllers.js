const partyModel = require("../../models/accounting/partyModel");

async function checkParty(id) {
	return await partyModel.findById(id);
}

const createParty = async (req, res) => {
	const { name, email, phoneNumber, address, partyType } = req.body;

	try {
		const isExist = await partyModel.findOne({ name });
		if (isExist) {
			return res.status(400).json({
				success: false,
				msg: "Party name already exists. Use a different name.",
			});
		}

		const response = await partyModel.create({
			name,
			email,
			phoneNumber,
			address,
			partyType,
		});

		res.status(201).json({
			success: true,
			msg: "Party created successfully!",
			party: response,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while creating the party.",
			error: error.message,
		});
	}
};

const getAllParties = async (req, res) => {
	try {
		const parties = await partyModel.find({});

		res.status(200).json({
			success: true,
			msg: "Parties fetched successfully!",
			count: parties.length,
			parties,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while fetching parties.",
			error: error.message,
		});
	}
};

const getSingleParty = async (req, res) => {
	const { id } = req.params;

	try {
		const party = await checkParty(id);

		if (!party) {
			return res.status(404).json({
				success: false,
				msg: "Party not found.",
			});
		}

		res.status(200).json({
			success: true,
			msg: "Party fetched successfully!",
			party,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while fetching the party.",
			error: error.message,
		});
	}
};

const updateParty = async (req, res) => {
	const { name, email, phoneNumber, address, partyType } = req.body;
	const { id } = req.params;

	try {
		const isExist = await checkParty(id);
		if (!isExist) {
			return res.status(404).json({
				success: false,
				msg: "Party not found.",
			});
		}

		const updatedParty = await partyModel.findByIdAndUpdate(
			id,
			{ name, email, phoneNumber, address, partyType },
			{ new: true, runValidators: true },
		);

		res.status(200).json({
			success: true,
			msg: "Party updated successfully!",
			party: updatedParty,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while updating the party.",
			error: error.message,
		});
	}
};

const deleteParty = async (req, res) => {
	const { id } = req.params;

	try {
		const isExist = await checkParty(id);
		if (!isExist) {
			return res.status(404).json({
				success: false,
				msg: "Party not found.",
			});
		}

		await partyModel.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
			msg: "Party deleted successfully!",
		});
	} catch (error) {
		res.status(500).json({
			// FIX: was 400
			success: false,
			msg: "Error occurred while deleting the party.",
			error: error.message,
		});
	}
};

module.exports = {
	createParty,
	getAllParties,
	getSingleParty,
	updateParty,
	deleteParty,
};

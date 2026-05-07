const account = require("../../models/accounting/accountModel");

async function checkAccount(bankAccountNo) {
	const found = await account.findOne({ bankAccountNo });
	return found; // returns document or null
}

const createAccount = async (req, res) => {
	const { ownerName, bankName, bankAccountNo, balance, type } = req.body;

	try {
		const isExist = await checkAccount(bankAccountNo);
		if (isExist) {
			return res.status(400).json({
				success: false,
				msg: "Account number already exists. Use a different account number.",
			});
		}

		const newAccount = await account.create({
			ownerName,
			bankName,
			bankAccountNo,
			balance,
			type,
		});

		res.status(201).json({
			success: true,
			msg: "Account created successfully!",
			account: newAccount,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while creating the account.",
			error: error.message,
		});
	}
};

const getAllAccounts = async (req, res) => {
	try {
		const accounts = await account.find();

		res.status(200).json({
			success: true,
			msg: "Accounts fetched successfully!",
			count: accounts.length,
			accounts,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while fetching accounts.",
			error: error.message,
		});
	}
};

const getAccountById = async (req, res) => {
	const { id } = req.params;

	try {
		const foundAccount = await account.findById(id);

		if (!foundAccount) {
			return res.status(404).json({
				success: false,
				msg: "Account not found.",
			});
		}

		res.status(200).json({
			success: true,
			msg: "Account fetched successfully!",
			account: foundAccount,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while fetching the account.",
			error: error.message,
		});
	}
};

const updateAccount = async (req, res) => {
	const { id } = req.params;
	const { ownerName, bankName, bankAccountNo, balance, type } = req.body;

	try {
		if (bankAccountNo) {
			const duplicate = await account.findOne({
				bankAccountNo,
				_id: { $ne: id },
			});

			if (duplicate) {
				return res.status(400).json({
					success: false,
					msg: "Account number already in use by another account.",
				});
			}
		}

		const updatedAccount = await account.findByIdAndUpdate(
			id,
			{ ownerName, bankName, bankAccountNo, balance, type },
			{ new: true, runValidators: true },
		);

		if (!updatedAccount) {
			return res.status(404).json({
				success: false,
				msg: "Account not found.",
			});
		}

		res.status(200).json({
			success: true,
			msg: "Account updated successfully!",
			account: updatedAccount,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while updating the account.",
			error: error.message,
		});
	}
};

const deleteAccount = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedAccount = await account.findByIdAndDelete(id);

		if (!deletedAccount) {
			return res.status(404).json({
				success: false,
				msg: "Account not found.",
			});
		}

		res.status(200).json({
			success: true,
			msg: "Account deleted successfully!",
			account: deletedAccount,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			msg: "Error occurred while deleting the account.",
			error: error.message,
		});
	}
};

module.exports = {
	createAccount,
	getAllAccounts,
	getAccountById,
	updateAccount,
	deleteAccount,
};

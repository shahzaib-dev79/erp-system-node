require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const assetRoutes = require("./src/routes/accounting/assetRoutes");
const journalLedgerRoutes = require("./src/routes/accounting/ledgerRoutes");
const accountRoutes = require("./src/routes/accounting/accountsRoutes");
const partyRoutes = require("./src/routes/accounting/partyRoutes");

const { errorHandler, notFound } = require("./src/middlewares/errorHandler");

connectDB();
const app = express();

app.use(helmet()); // Set secure HTTP headers
app.use(cors({}));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests. Slow down." },
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 🚀",
    env: process.env.NODE_ENV,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/accounting/assets", assetRoutes);
app.use("/api/accounting/ledger", journalLedgerRoutes);
app.use("/api/accounting/accounts", accountRoutes);
app.use("/api/accounting/party", partyRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const auditRoutes = require("./routes/audit.routes");
const assetRoutes = require("./routes/assets.routes");
const bookingRoutes = require("./routes/booking.routes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      success: true,
      message: "PostgreSQL Connected Successfully",
      serverTime: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Database Connection Failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
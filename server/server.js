const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const volunteerRoutes = require("./routes/volunteerRoutes");
const activityRoutes = require("./routes/activityRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/volunteers", volunteerRoutes);
app.use("/activities", activityRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.get("/", (req, res) => {
    res.send("Volunteer Manager API is running");
});

app.get(
    "/protected",
    authMiddleware,
    roleMiddleware(["admin"]),
    (req, res) => {
        res.status(200).json({
            message: "You accessed an admin protected route",
            user: req.user
        });
    }
);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
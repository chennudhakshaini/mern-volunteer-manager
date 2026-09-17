const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const volunteerRoutes = require("./routes/volunteerRoutes");
const activityRoutes = require("./routes/activityRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();
app.use(express.json());
app.use("/volunteers", volunteerRoutes);
app.use("/activities", activityRoutes);
app.use("/assignments", assignmentRoutes);

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

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
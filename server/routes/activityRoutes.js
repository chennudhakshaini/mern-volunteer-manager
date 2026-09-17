const express = require("express");
const Activity = require("../models/Activity");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const activity = await Activity.create(req.body);

        res.status(201).json(activity);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const activities = await Activity.find();

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({
            message: "Invalid activity ID"
        });
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!activity) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }

        res.status(200).json(activity);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);

        if (!activity) {
            return res.status(404).json({
                message: "Activity not found"
            });
        }

        res.status(200).json({
            message: "Activity deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid activity ID"
        });
    }
});

module.exports = router;
const express = require("express");
const Assignment = require("../models/Assignment");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware,
roleMiddleware(["admin"]),async (req, res) => {
    try {
        const assignment = await Assignment.create(req.body);

        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.get("/", authMiddleware,
roleMiddleware(["admin"]),async (req, res) => {
    try {
        const assignments = await Assignment.find()
            .populate("volunteer")
            .populate("activity");

        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/:id",authMiddleware,
roleMiddleware(["admin"]), async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("volunteer")
            .populate("activity");

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({
            message: "Invalid assignment ID"
        });
    }
});

router.patch("/:id", authMiddleware,
roleMiddleware(["admin"]),async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate("volunteer")
            .populate("activity");

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete("/:id", authMiddleware,
roleMiddleware(["admin"]),async (req, res) => {
    try {
        const assignment = await Assignment.findByIdAndDelete(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        res.status(200).json({
            message: "Assignment deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid assignment ID"
        });
    }
});

module.exports = router;
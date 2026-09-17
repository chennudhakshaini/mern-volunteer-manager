const express = require("express");
const Volunteer = require("../models/Volunteer");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {
            try {
        const volunteer = await Volunteer.create(req.body);

        res.status(201).json(volunteer);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {    try {
        const { skill, availability } = req.query;

        const filter = {};

        if (skill) {
            filter.skills = skill;
        }

        if (availability) {
            filter.availability = availability;
        }

        const volunteers = await Volunteer.find(filter);

        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {    try {
        const volunteer = await Volunteer.findById(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found"
            });
        }

        res.status(200).json(volunteer);
    } catch (error) {
        res.status(400).json({
            message: "Invalid volunteer ID"
        });
    }
});

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {    try {
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found"
            });
        }

        res.status(200).json(volunteer);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["admin"]),
    async (req, res) => {    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found"
            });
        }

        res.status(200).json({
            message: "Volunteer deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Invalid volunteer ID"
        });
    }
});

module.exports = router;
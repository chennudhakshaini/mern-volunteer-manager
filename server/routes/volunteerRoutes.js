const express = require("express");
const Volunteer = require("../models/Volunteer");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const volunteer = await Volunteer.create(req.body);

        res.status(201).json(volunteer);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
        required: true
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "assigned"
    }
});

module.exports = mongoose.model("Assignment", assignmentSchema);
const mongoose = require("mongoose");
require("dotenv").config();

const assignmentSchema = new mongoose.Schema({
    course: { type: mongoose.Types.ObjectId, required: true, ref: "Course" },
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    deadline: { type: Date, required: true },
    users_taken: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);


exports.Assignment = Assignment;
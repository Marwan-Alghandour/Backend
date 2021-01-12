const mongoose = require("mongoose");
const joi = require("@hapi/joi");


const CourseSchema = new mongoose.Schema({
    name: { type: String, minlength: 5, maxlength: 1023, required: true },
    code: { type: String, minlength: 1, maxlength: 255, required: true, unique: true },
    profs: { type: [String] },
    TAs: { type: [String] },
    credit_hours: { type: Number, min: 0, max: 10 },
    content: { type: [Object], default: [] },
    users: [{ type: mongoose.Types.ObjectId, ref: "User" }]
});

const Course = mongoose.model("Course", CourseSchema);


function validateCourse(data) {
    /**
     * schema:
     *  username
     *  password
     */
    const Schema = joi.object({
        name: joi.string().min(5).max(255).required(),
        code: joi.string().min(1).max(255).required(),
        profs: joi.array(),
        TAs: joi.array(),
        credit_hours: joi.number().min(0).max(10)
    });
    // const result = joi.validate(data, Schema)
    const result = Schema.validate(data);
    if (result.error) return result.error.details[0].message;
    else return false;
};


module.exports.Course = Course;
module.exports.validateCourse = validateCourse;

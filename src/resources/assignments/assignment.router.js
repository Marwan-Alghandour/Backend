const { create_assignment, submit_assignment } = require("./assignment.controller");

const assignmentRouter = app => {
    app.post("/create-assignment", [], create_assignment);
    app.post("/submit-assignment/:assignment_id", [], submit_assignment);
};

module.exports = assignmentRouter;


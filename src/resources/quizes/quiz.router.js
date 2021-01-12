const {create_quiz} = require("./quiz.controller");

const quizRouter = app => {
    app.post("/create-quiz", [], create_quiz);
};

module.exports = quizRouter;


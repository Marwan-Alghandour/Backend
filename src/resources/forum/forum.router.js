const { get_discussion, ask_question } = require("./forum.controller");

const forumRouter = app => {
    app.get("/forum/:courseID", [], get_discussion);
    app.post("/forum-ask", [], ask_question)
};

module.exports = forumRouter;

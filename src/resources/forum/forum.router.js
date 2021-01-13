const { get_discussion } = require("./forum.controller");

const forumRouter = app => {
    app.get("/forum/:courseID", [], get_discussion);
};

module.exports = forumRouter;

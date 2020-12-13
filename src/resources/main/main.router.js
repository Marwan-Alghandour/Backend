const mainRouter = app => {
    app.get ('/', [], async (req, res) => {
        return res.send("Hello, World");
    });
  };
  
module.exports = mainRouter;
  
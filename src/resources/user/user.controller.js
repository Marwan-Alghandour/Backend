const bcrypt = require("bcrypt");
const { User, validateUser } = require("./user.model.js");

const login = async function(req, res) {
    /**
     * req.body: {
     *     "username": String,
     *     "password": String
     * }
     */
    
    const result = validateUser(req.body);
    if (result) return res.status(400).send(result);
    
    try{
        const user = await User.findOne({username: req.body.username});
        if(!user) return res.status(400).send("Wrong username or password");

        const authenticated = await bcrypt.compare(req.body.password, user.password);
        if(!authenticated) return res.status(400).send("Wrong username or password");

        const token = await user.generateAuthToken();
        res.json({token: token, role: user.role, username: user.username, email: user.email});
    }catch(e){
        return res.status(500).send(e.message);
    }
}

module.exports = {login};
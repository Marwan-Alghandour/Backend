const jwt = require("jsonwebtoken");
const { Course, validateCourse } = require("./course.model");

async function create_course(req, res) {
    const token = req.headers.token;
    if(!token) return res.status(401).send({message: "Forbidden"});

    const payload = jwt.decode(token);
    if(payload.role !== "admin") return res.status(401).send({message: "Forbidden"});

    const error = validateCourse(req.body);
    if(error) return res.status(400).send({message: error});
    
    try {
        let course = await Course.findOne({code: req.body.code});
        if(course) return res.status(400).send({message: "Course with this code already exists"});

        course = new Course({
            name: req.body.name,
            code: req.body.code,
            profs: req.body.profs,
            TAs: req.body.TAs,
            credit_hours: req.body.credit_hours
        });

        await course.save();
        return res.send({message: `Course '${course.name}' was created successfully`});

    }catch(e){
        return res.status(500).send({message: e.message});
    }
}

module.exports.create_course = create_course;

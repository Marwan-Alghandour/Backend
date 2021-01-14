const {Course} = require("../courses/course.model");
const {Assignment} = require("./assignment.model");
const jwt = require("jsonwebtoken");
const { User } = require("../user/user.model");

const create_assignment = async function(req, res){

    const token = req.headers.token;
    if (!token) return res.status(401).send("Forbidden");

    const payload = jwt.verify(token, process.env.APP_KEY);
    if(!payload || (payload.role !== "teacher" && payload.role !== "admin"))
        return res.status(401).send({message: "Forbidden"});

    if(!req.body.course_code) return res.status(404).send({message: "Please send the course id"});

    const ass = req.body.assignment;

    try {
        const course = await Course.findOne({code: req.body.course_code});
        if(!course) return res.status(404).send({message: `Course with code ${req.body.course_code} note found`})

        const assignment = new Assignment({
            course: course._id,
            title: ass.title,
            discreption: ass.discreption,
            deadline: ass.deadline,
            url: ass.url
        });

        await assignment.save();
        await Course.findOneAndUpdate({code: req.body.course_code}, {$push: {assignments: assignment._id}})
        res.send({message: "Assignment Created successfully"});
    }catch(e){
        return res.status(500).send({message: e.message});
    }
}

const submit_assignment = async function(req, res){

    const token = req.headers.token;
    if (!token) return res.status(401).send("Forbidden");

    const assignment_id = req.params.assignment_id;
    if(!assignment_id) return res.status(404).send({message: "Please send assignment id"});

    const payload = jwt.verify(token, process.env.APP_KEY);
    if(!payload) return res.status(401).send({message: "Forbidden"});

    try{

        await User.findByIdAndUpdate(payload.user_id, {
            $push: {taken_assignments: assignment_id}
        }, {new: true, useFindAndModify: false});

        await Assignment.findByIdAndUpdate(assignment_id, {
            $push: {users_taken: payload.user_id}
        }, {new: true, useFindAndModify: false});


        res.send({message: "Success"});
    }catch(e){
        return res.status(500).send({message: e.message});
    }

}

const grade_assignment = async function(req, res){

    const token = req.headers.token;
    if (!token) return res.status(401).send("Forbidden");

    const assignment_id = req.params.assignment_id;
    if(!assignment_id) return res.status(404).send({message: "Please send assignment id"});

    const grade = req.params.grade;
    if(!grade) return res.status(404).send({message: "Please send the grade"});

    const payload = jwt.verify(token, process.env.APP_KEY);
    if(!payload || payload.role !== "teacher") return res.status(401).send({message: "Forbidden"});

    try{

        let user = await User.find({ taken_assignments: assignment_id });

        if (!user) return res.status(404).send({ message: "This assignment_id is not found" });

        let course = await Assignment.find({ users_taken: user.user_id });

        await User.findOneAndUpdate({ username: user.username }, { grade: {course: course.course, grade: grade} }, { useFindAndModify: false } )

        res.send({message: "Success"});
    }catch(e){
        return res.status(500).send({message: e.message});
    }

}

module.exports = { create_assignment, submit_assignment, grade_assignment };
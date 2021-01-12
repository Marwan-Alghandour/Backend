const {Course} = require("../courses/course.model");
const {Quiz} = require("./quiz.model")

const create_quiz = async function(req, res){
    if(!req.body.course_code) return res.status(404).send({message: "Please send the course id"});
    const content_answers = req.body.quiz;
    let content = [];
    let answers = [];
    for(q of content_answers){
        content.push({
            hash: q.hash,
            question: q.question,
            valid_answers: q.valid_answers
        });
        answers.push({
            hash: q.hash,
            answer: q.valid_answers[q.answer]
        })
    }

    try {
        const course = await Course.findOne({code: req.body.course_code});
        if(!course) return res.status(404).send({message: `Course with code ${req.body.course_code} note found`})
        const quiz = new Quiz({
            course: course._id,
            content: content,
            correct_answers: answers,
        });

        await quiz.save();
        res.send({message: "Quiz Created successfully"});
    }catch(e){
        return res.status(500).send({message: e.message});
    }
}


module.exports.create_quiz = create_quiz;
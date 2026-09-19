const express = require('express');
const router = express.Router();

let students = require('../data/students.js');



router.get('/', (req, res) => {
    res.status(200).json(students);
});



router.get('/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const student = students.find(student => student.id === id);

    if (!student) {
        return res.status(404).json({
            message: "student not found"
        });
    }

    res.status(200).json(student);
});



router.post('/', (req, res) => {

    const { name, course, age } = req.body;

    if (!name || !course || !age) {
        return res.status(400).json({
            message: "Name, course and age are required"
        });
    }

    const newStudent = {
        id: students.length > 0
            ? students[students.length - 1].id + 1
            : 1,
        name: name,
        course: course,
        age: age
    };

    students.push(newStudent);

    res.status(201).json({
        message: "student added successfully",
        student: newStudent
    });
});



router.put("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const student = students.find(student => student.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { name, course, age } = req.body;

    if (!name || !course || !age) {
        return res.status(400).json({
            message: "Name, course and age are required"
        });
    }

    student.name = name;
    student.course = course;
    student.age = age;

    res.status(200).json({
        message: "Student updated successfully",
        student: student
    });
});



router.delete("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const studentIndex = students.findIndex(
        student => student.id === id
    );

    if (studentIndex === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const deletedStudent = students.splice(studentIndex, 1);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent[0]
    });
});


module.exports = router;







import mongoose from 'mongoose';
import express from 'express';

import Student from './models/Student.js';

try {
    await mongoose.connect('mongodb://localhost:27017/test1');

    console.log('Connected to DB');
} catch (err) {
    console.log('Failed to connect DB...');
    console.log(err.message);
}

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello from expres');
});

// Read multiple records from db
app.get('/students', async (req, res) => {
    const studentsQuery = Student.find();

    if (req.query.minAge) {
        // studentsQuery.find({ age: { $gt: req.query.minAge } }) // Native mongodb query
        studentsQuery
            .where('age')
            .gt(req.query.minAge); // Mongoose query
    }

    const students = await studentsQuery;

    res.json(students);
});

app.get('/students/create', (req, res) => {
    res.send(`
    <form method="POST">
        <input type="text" name="name" placeholder="Name">
        <input type="number" name="age" placeholder="Age">
        <input type="submit" value="Create">
    </form>
    `)
});

// Read single record from db
app.get('/students/:studentId', async (req, res) => {
    const student = await Student.findById(req.params.studentId);

    res.send(student.greet('Everyone'));
});


// Create new record in db
app.post('/students/create', async (req, res) => {
    // First Method for Cretion
    // const student = new Student(req.body);
    // await student.save();

    // Second method for Creation
    const student = await Student.create(req.body);

    res.redirect('/students');
});

// Update record
app.get('/students/:studentId/edit', async (req, res) => {
    // const student = await Student.find({_id: req.params.studentId})
    const student = await Student.findById(req.params.studentId);

    res.send(`
    <form method="POST">
        <input type="text" name="name" value="${student.name}" placeholder="Name">
        <input type="number" name="age" value="${student.age}" placeholder="Age">
        <input type="submit" value="Edit">
    </form>
    `)
});

app.post('/students/:studentId/edit', async (req, res) => {
    // First method
    // const student = await Student.findById(req.params.studentId); 
    // student.name = req.body.name;
    // student.age = req.body.age;
    // await student.save();

    // Second method
    await Student.findByIdAndUpdate(req.params.studentId, req.body);

    res.redirect('/students');
});

// Delete from db
app.get('/students/:studentId/delete', async (req, res) => {
    const result = await Student.findByIdAndDelete(req.params.studentId);

    console.log(result);

    res.redirect('/students');
});

app.listen(5000, () => console.log('Listening on http://localhost:5000'));

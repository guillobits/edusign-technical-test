import express from 'express';
import cors from 'cors';
import http from 'http';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');



app.get('/students', (req, res) => {
    try {
        const fileContent = fs.readFileSync("../db.json", "utf-8");
        const db = JSON.parse(fileContent);
        const students = db.attendanceSheet?.STUDENTS;
        res.json(students);
    }
    catch (err) {
        res.status(500).end();
    }
});

app.post('/students/:id/signature', (req, res) => {
    const studentId = Number(req.params.id);

    const signature = req.body.signature;

    try {
        const fileContent = fs.readFileSync("../db.json", "utf-8");
        const db = JSON.parse(fileContent);

        const idx = db.attendanceSheet?.STUDENTS?.findIndex((student : any) => {
            return student.id === studentId;
        });

        if (idx < 0) {
            res.status(404).end();
        }
        db.attendanceSheet.STUDENTS[idx].presenceState = true;
        db.attendanceSheet.STUDENTS[idx].signatureTimestamp = Date.now();
        db.attendanceSheet.STUDENTS[idx].signature = signature;

        fs.writeFileSync("../db.json", JSON.stringify(db));
        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
    }
});

app.delete('/students/:id/signature', (req, res) => {
    const studentId = Number(req.params.id);

    try {
        const fileContent = fs.readFileSync("../db.json", "utf-8");
        const db = JSON.parse(fileContent);

        const idx = db.attendanceSheet?.STUDENTS?.findIndex((student : any) => {
            return student.id === studentId;
        });

        if (idx < 0) {
            res.status(404).end();
        }
        db.attendanceSheet.STUDENTS[idx].presenceState = null;
        db.attendanceSheet.STUDENTS[idx].signatureTimestamp = null;
        db.attendanceSheet.STUDENTS[idx].signature = null;

        fs.writeFileSync("../db.json", JSON.stringify(db));
        res.status(200).end();
    }
    catch (err) {
        res.status(500).end();
    }
});

const port = 3000;

(async () => {
    http.createServer(app).listen(port, () => {
        console.log('Server is running on port 3000');
    });
})();

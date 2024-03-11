import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.get('/', (req, res) => {});

const port = 3000;

(async () => {
    http.createServer(app).listen(port, () => {
        console.log('Server is running on port 3000');
    });
})();

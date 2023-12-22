const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./movies.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the movies database.');
});

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: '*'
}));

const port = 3000;

function randomErrorMiddleware(req, res, next) {
    if(Math.random() <= 0.33) {
        res.status(500).json({ error: 'Error' });
    } else {
        next();
    }
}

app.use(randomErrorMiddleware);

app.get('/movies', (req, res) => {
    db.all('SELECT * FROM movies', (err, rows) => {
        if (err) console.error(err.message);
        res.json(rows);
    });
});

app.post('/movies', express.json(), (req, res) => {
    db.run('INSERT INTO movies(name) VALUES(?)', req.body.name, function(err) {
        if (err) console.error(err.message);
        res.json({ id: this.lastID });
    });
});

app.get('/movies/:movie_id/comments', (req, res) => {
    db.all('SELECT * FROM comments WHERE movie_id = ?', req.params.movie_id, (err, rows) => {
        if (err) console.error(err.message);
        res.json(rows);
    });
});

app.post('/movies/:movie_id/comments', express.json(), (req, res) => {
    db.run('INSERT INTO comments(text, user_name, movie_id) VALUES(?, ?, ?)', [req.body.text, req.body.user_name, req.params.movie_id], function(err) {
        if (err) console.error(err.message);
        res.json({ id: this.lastID });
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

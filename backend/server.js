const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5050;
var cors = require('cors');
app.use(cors());

const db = new sqlite3.Database('tietokantaprojekti.sqlite');

app.get('/data', (req, res) => {
    const data = {};
    db.all('SELECT * FROM Game', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        data.game = rows;
        db.all('SELECT * FROM Publisher', (err, rows) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            data.publisher = rows;
            db.all('SELECT * FROM Developer', (err, rows) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                data.developer = rows;
                db.all('SELECT * FROM Genre', (err, rows) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }
                    data.genre = rows;
                    db.all('SELECT * FROM Reviews', (err, rows) => {
                        if (err) {
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }
                        data.review = rows;
                        db.all('SELECT * FROM Restriction', (err, rows) => {
                            if (err) {
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }
                            data.restriction = rows;
                            db.all('SELECT * FROM ControllerSupport', (err, rows) => {
                                if (err) {
                                    res.status(500).json({ error: 'Internal Server Error' });
                                    return;
                                }
                                data.controllersupport = rows;

                                res.json(data);
                            });
                        });
                    });
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

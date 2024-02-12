const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5050;
const cors = require('cors');
app.use(cors());

const db = new sqlite3.Database('tietokantaprojekti.sqlite');

app.get('/publisherData/:publisherId', (req, res) => {
    const publisherId = req.params.publisherId;

    db.all('SELECT g.*, p.publisher_name, d.developer_name, r.is_positive AS review, re.restriction_value, cs.supports_controller FROM Game g LEFT JOIN Publisher p ON g.publisher_id = p.id LEFT JOIN Developer d ON g.id = d.game_id LEFT JOIN Reviews r ON g.id = r.game_id LEFT JOIN Restriction re ON g.id = re.game_id LEFT JOIN ControllerSupport cs ON g.id = cs.game_id WHERE g.publisher_id = ?', [publisherId], (err, games) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        db.all('SELECT * FROM Genre', (err, genres) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            db.all('SELECT * FROM ControllerSupport', (err, controllerSupport) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                const processedGames = games.map(game => {
                    game.genres = genres.filter(genre => genre.game_id === game.id).map(genre => genre.genre_name);
                    game.controllerSupport = controllerSupport.filter(cs => cs.game_id === game.id);
                    return game;
                });

                res.json({ games: processedGames });
            });
        });
    });
});

app.get('/data', (req, res) => {
    const data = {};
    db.all('SELECT * FROM Game', (err, games) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        data.games = games;

        db.all('SELECT * FROM Publisher', (err, publishers) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            data.publishers = publishers;

            db.all('SELECT * FROM Developer', (err, developers) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
    
                data.developers = developers;

                db.all('SELECT * FROM Reviews', (err, reviews) => {
                    if (err) {
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }
            
                    data.reviews = reviews;

                    db.all('SELECT * FROM Restriction', (err, restrictions) => {
                        if (err) {
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }
                        
                        data.restrictions = restrictions;
                        
                        db.all('SELECT * FROM ControllerSupport', (err, supportscontrollers) => {
                            if (err) {
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }
                        
                            data.controllerSupport = supportscontrollers;
                        
                            res.json(data);
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

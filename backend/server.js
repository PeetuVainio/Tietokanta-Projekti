const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5050;
const cors = require('cors');
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('tietokantaprojekti.sqlite');

app.delete('/remove/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM Game WHERE id = ?', id, function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log(`Data with ID ${id} has been successfully removed`);
        res.sendStatus(200);
    });
});

app.post('/add', (req, res) => {
    const formData = req.body;

    if (!formData.game_name || !formData.released || !formData.price_value || !formData.publisher_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO Game (game_name, released, price_value, publisher_id) VALUES (?, ?, ?, ?)', 
    [formData.game_name, formData.released, formData.price_value, formData.publisher_id], 
    function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log(`Data has been successfully added with ID ${this.lastID}`);
        res.sendStatus(200);
    });
});

app.post('/add/publisher', (req, res) => {
    const formData = req.body;

    if (!formData.publisher_name || !formData.publisher_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO Publisher (publisher_name, id) VALUES (?, ?)', 
    [formData.publisher_name, formData.publisher_id], 
    function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log(`Publisher added with ID: ${this.lastID}`);
        res.sendStatus(200);
    });
});

app.post('/add/developer', (req, res) => {
    const formData = req.body;

    if (!formData.developer_name || !formData.game_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO Developer (developer_name, game_id) VALUES (?, ?)', 
    [formData.developer_name, formData.game_id], 
    function(err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log(`Developer has been successfully added with ID ${this.lastID}`);
        res.sendStatus(200);
    });
});

app.post('/addGenre', (req, res) => {
    const formData = req.body;

    if (!formData.genre_name || !formData.game_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO Genre (genre_name, game_id) VALUES (?, ?)',
        [formData.genre_name, formData.game_id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log(`Genre has been successfully added with ID ${this.lastID}`);
            res.sendStatus(200);
        });
});

app.post('/addReview', (req, res) => {
    const formData = req.body;

    if (!formData.is_positive || !formData.game_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO Reviews (is_positive, game_id) VALUES (?, ?)',
        [formData.is_positive, formData.game_id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log(`Review has been successfully added with ID ${this.lastID}`);
            res.sendStatus(200);
        });
});

app.post('/addRestriction', (req, res) => {
    const formData = req.body;

    if (!formData.restriction_value || !formData.game_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO Restriction (restriction_value, game_id) VALUES (?, ?)',
        [formData.restriction_value, formData.game_id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log(`Restriction has been successfully added with ID ${this.lastID}`);
            res.sendStatus(200);
        });
});

app.post('/addControllerSupport', (req, res) => {
    const formData = req.body;

    if (!formData.supports_controller || !formData.game_id) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    db.run('INSERT INTO ControllerSupport (supports_controller, game_id) VALUES (?, ?)',
        [formData.supports_controller, formData.game_id],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log(`Controller support has been successfully added with ID ${this.lastID}`);
            res.sendStatus(200);
        });
});

app.post('/search', (req, res) => {
    const searchParams = req.body;

    let query = 'SELECT g.*, p.publisher_name, d.developer_name, r.is_positive AS review, re.restriction_value FROM Game g';
    query += ' LEFT JOIN Publisher p ON g.publisher_id = p.id';
    query += ' LEFT JOIN Developer d ON g.id = d.game_id';
    query += ' LEFT JOIN Reviews r ON g.id = r.game_id';
    query += ' LEFT JOIN Restriction re ON g.id = re.game_id';
    query += ' WHERE 1 = 1';

    const queryParams = [];

    if (searchParams.game_name) {
        query += ' AND g.game_name LIKE ?';
        queryParams.push(`%${searchParams.game_name}%`);
    }
    if (searchParams.released) {
        query += ' AND g.released LIKE ?';
        queryParams.push(`%${searchParams.released}%`);
    }
    if (searchParams.price_value) {
        query += ' AND g.price_value LIKE ?';
        queryParams.push(`%${searchParams.price_value}%`);
    }
    if (searchParams.publisher_name) {
        query += ' AND p.publisher_name = ?';
        queryParams.push(searchParams.publisher_name);
    }
    if (searchParams.developer_name) {
        query += ' AND d.developer_name = ?';
        queryParams.push(searchParams.developer_name);
    }
    if (searchParams.genre_name) {
        query += ' AND g.id IN (SELECT game_id FROM Genre WHERE genre_name = ?)';
        queryParams.push(searchParams.genre_name);
    }
    if (searchParams.review) {
        query += ' AND r.is_positive = ?';
        queryParams.push(searchParams.review);
    }
    if (searchParams.restriction_value) {
        query += ' AND re.restriction_value = ?';
        queryParams.push(searchParams.restriction_value);
    }
    if (searchParams.supports_controller) {
        query += ' AND g.id IN (SELECT game_id FROM ControllerSupport WHERE supports_controller = ?)';
        queryParams.push(searchParams.supports_controller);
    }

    db.all(query, queryParams, (err, games) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const gameIds = games.map(game => game.id);
        db.all(`SELECT * FROM Genre WHERE game_id IN (${gameIds.map(() => '?').join(',')})`, gameIds, (err, genres) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            db.all(`SELECT * FROM ControllerSupport WHERE game_id IN (${gameIds.map(() => '?').join(',')})`, gameIds, (err, controllerSupport) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                const genreMap = genres.reduce((acc, genre) => {
                    acc[genre.game_id] = acc[genre.game_id] || [];
                    acc[genre.game_id].push(genre.genre_name);
                    return acc;
                }, {});

                const controllerSupportMap = controllerSupport.reduce((acc, cs) => {
                    acc[cs.game_id] = acc[cs.game_id] || [];
                    acc[cs.game_id].push(cs.supports_controller);
                    return acc;
                }, {});

                const processedGames = games.map(game => {
                    game.genres = genreMap[game.id] || [];
                    game.controllerSupport = controllerSupportMap[game.id] || []; 
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
                        
                        res.json(data);
                    });
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

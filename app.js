const express = require("express");
const mysql = require("mysql");
const app = express();
const port = process.env.PORT || 3000;

//Body Parser (Facilidade de JSON<=>API)
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// MySQL Login e Acesso (No meu caso, usei meu Hostinger)
const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'a',
    user: 'b',
    password: 'c',
    database: 'd'
});

//DATABASE: MOVIES
//GET "/movie" 
//Informa tudo que há na tabela "movies"
app.get('/movie', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('SELECT * from movies', (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});


//GET "/movie/:id"  
//Informa os dados de um filme baseado em id.
app.get('/movie/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('SELECT * from movies WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});

//DELETE "/movie/:id"  
//Elimina os dados de um filme baseado em id.
app.delete('/movie/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('DELETE from movies WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Filme de id: ${[req.params.id]} foi eliminado.`);
            } else {
                console.log(err);
            }
        })
    })
});

//POST "/movie"  
//Insere os dados para um novo filme, criando um id auto incrementável.
//PADRÃO: {"name: "À espera de um milagre"}
app.post('/movie', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        
        //Body Parser
        const params = req.body;

        //SQL Query
        connection.query('INSERT INTO movies SET ?', params, (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Um novo filme foi adicionado.\nNome do Filme: ${params.name}`);
            } else {
                console.log(err);
            }
        })
    })
});

//UPDATE "/movie"  
//Atualiza dados de um filme baseado em id.
app.put('/movie', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        
        //Body Parser (Para fins de facilitar o push baseado em JSON)
        const { id, name } = req.body;

        //SQL Query
        connection.query('UPDATE movies SET name = ? WHERE id = ?', [name, id],  (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Filme editado. ID: ${id}\nNome do Filme: ${name}`);
            } else {
                console.log(err);
            }
        })
    })
});

//DATABASE: USERS
//GET "/user" 
//Informa tudo que há na tabela "users"
app.get('/user', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query 
        connection.query('SELECT * from users', (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});


//GET "/user/:id"  
//Informa os dados de um usuário baseado em id.
app.get('/user/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('SELECT * from users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});

//DELETE "/user/:id"  
//Elimina os dados de um usuário baseado em id.
app.delete('/user/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('DELETE from users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Usuário de id: ${[req.params.id]} foi.`);
            } else {
                console.log(err);
            }
        })
    })
});

//POST "/user"  
//Insere os dados para um novo usuário, criando um id auto incrementável.
//PADRÃO: {"name: "Alessandro"}
app.post('/user', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        
        //Body Parser (Para fins de facilitar o push baseado em JSON)
        const params = req.body;

        //SQL Query
        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Novo usuário criado.\nNome do Usuário: ${params.name}`);
            } else {
                console.log(err);
            }
        })
    })
});

//UPDATE "/user"  
//Atualiza dados de um usuário baseado em id.
app.put('/user', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        
        //Body Parser (Para fins de facilitar o push baseado em JSON)
        const { id, name } = req.body;

        //SQL Query
        connection.query('UPDATE users SET name = ? WHERE id = ?', [name, id],  (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Usuário editado. ID: ${id}\nNome do Usuário: ${name}`);
            } else {
                console.log(err);
            }
        })
    })
});

//CROSSTABLE USUÁRIO X FILME
//POST "/info"  
//Insere dados no crosstable "user_movie", usando apenas ID do filme e do usuário'.
//PADRÃO: {"idMovies": 4, "idUsers": 1}
app.post('/info', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        
        //Body Parser
        const params = req.body;

        //SQL Query
        connection.query('INSERT INTO user_movie SET ?', params, (err, rows) => {
            connection.release()

            if(!err){
                res.send(`Novos dados foram criados.\nUsuário ID: ${params.idUsers}\Filme ID: ${params.idMovies}`);
            } else {
                console.log(err);
            }
        })
    })
});


//GET "/info" 
//Informa todo o conteúdo da tabela "user_movie", referente ao crosstable USUÁRIO X FILME.
app.get('/info', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('SELECT * from user_movie', (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});


//GET "/movies"
//Informa o número de usuários que assistiram a um filme, baseado em id.
app.get('/movies/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('SELECT count(*) AS viewers FROM user_movie WHERE idMovies = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});

//GET "/users"
//Informa o total de filmes assistidos por um usuário, baseado em id.
app.get('/users/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        //SQL Query
        connection.query('SELECT count(*) AS watched FROM user_movie WHERE idUsers = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    })
});

//Status de Pronto
app.listen(port, () => console.log(`Ready - Port: ${port}`));
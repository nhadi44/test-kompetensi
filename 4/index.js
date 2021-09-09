const express = require('express')
const hbs = require('hbs')
const path = require('path')
const session = require('express-session')

const app = express()
const port = 3000

app.set('view engine', 'hbs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/public', express.static(path.join(__dirname, 'public')))

hbs.registerPartials(__dirname + '/views/partials')

const dbConnection = require('./connection/db')
const e = require('express')

const isLogin = false

app.use(
    session({
        cookie: {
            maxAge: 1000 * 60 * 60 * 60 * 1,
        },
        store: new session.MemoryStore(),
        resave: false,
        saveUninitialized: true,
        secret: 'Secret',
    })
)


app.use(function (req, res, next) {
    res.locals.message = req.session.message
    delete req.session.message;
    next();
})


app.get('/', (req, res) => {
    const title = "Taks Collection"
    res.render('index', {
        title

    })
})

app.get('/login', (req, res) => {
    const title = "Login"
    res.render('login', {
        title
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (username == '' || password == '') {
        req.session.message = {
            type: 'danger',
            message: 'Please insert all field'
        }
        res.redirect('/login')
    }

    const query = `SELECT * FROM users_tb where username = "${username}" AND password = "${password}"`

    dbConnection.connect((err, conn) => {
        if (err) throw err
        conn.query(query, (err, results) => {
            if (err) throw err

            if (results.length == 0) {
                req.session.message = {
                    type: 'danger',
                    message: 'Email or Password wrong!'
                }
                res.redirect('/login')
            } else {
                req.session.message = {
                    type: 'success',
                    message: 'Login Successfully'
                }

                req.session.isLogin = true

                req.session.user = {
                    id: results[0].id,
                    email: results[0].email,
                    name: results[0].name,
                    status: results[0].status
                }
            }
            res.redirect('/collection')
        })
    })
})

app.get('/register', (req, res) => {
    const title = "Register"
    res.render('register', {
        title
    })
})

app.post('/register', (req, res) => {
    const { email, username, password } = req.body

    if (email == '' || username == '' || password == '') {
        req.session.message = {
            type: 'danger',
            message: 'Please insert all field!'
        }
        return res.redirect('/register')
    }

    const query = `INSERT INTO users_tb (email, username, password) values ("${email}", "${username}", "${password}")`

    dbConnection.connect((err, conn) => {
        if (err) throw err
        conn.query(query, (err, results) => {
            if (err) throw err
            req.session.message = {
                type: 'success',
                message: 'Register Successfully'
            }
            res.redirect('/register')
        })
    })
})


app.get('/collection', (req, res) => {
    const title = "Collection"
    const query = `SELECT * FROM collections_tb`
    let collection = []
    dbConnection.connect((err, conn) => {
        if (err) throw err
        conn.query(query, (err, results) => {
            for (var result of results) {
                collection.push({
                    id: result.id,
                    name: result.name
                })
            }
            console.log(result)
            res.render('collection', {
                title,
                isLogin: req.session.isLogin,
                collection
            })
        })
    })
})

app.get('/taks', (req, res) => {
    const title = "Your Taks"
    const query = `SELECT taks_tb.name, cast(taks_tb.is_done as unsigned) as isdone,
    case when CAST(taks_tb.is_done as unsigned) = 0 then 'Unfinished' else 'Finished' end as status, collections_tb.name as collection
    FROM taks_tb
    inner join collections_tb on collections_tb.id = taks_tb.id`
    dbConnection.connect((err, conn) => {
        if (err) throw err
        conn.query(query, (err, results) => {
            if (err) throw err
            console.log(results)
            res.render('taks', {
                title,
                isLogin: req.session.isLogin,
                results
            })
        })
    })
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running http://localhost:${port}`)
})
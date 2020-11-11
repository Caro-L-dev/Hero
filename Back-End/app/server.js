// Package pour express (server)
const express = require('express');

// Package pour les variables d'environements
const dotenv = require('dotenv');
dotenv.config();

// On récupère le router 
const router = require('./router');

// On lance le server express
const app = express();

// Si la variable d'environement PORT n'est pas dispo le port sera 8000
const port = process.env.PORT || 8000;

// on rajoute la gestion des POST body
app.use(express.urlencoded({extended: true}));

// On dit que le fichier dist est static (n'existera qu'une fois le front compilé et déplacé a la racine du back)
app.use(express.static('dist'));

// et on rajoute la gestion des sessions
const session = require('express-session');
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'Un Super Secret',
  cookie: {
    httpOnly: true, // empêche l'accès au cookie depuis du javascript côté front
    secure: false, // HTTPS est nécessaire si l'on veut passer l'option à true
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24, // durée de vie du cookie en milliseconds, ici ça donne 1 jour
  },
}));

// middleWare qui crée la session user (default: {connected_user = false})
const userMiddleware = require('./middlewares/user');
app.use(userMiddleware);

// Si on m'envoie du JSON, je le mettrai en forme dans request.body, pour qu'il soit accessible
app.use(express.json());

// On ouvre l'accés a l'API pour le localhost, on ajoutera l'url ou on va deployer l'API

// app.use(cors({
//   origin: 'http://localhost:3005',
//   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
//   credentials: true
// }));

// app.use(cors({
//   credentials: true,
//   origin:'',
//   methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
// }));

app.use((req, res, next) => {

  // on autorise explicitement le domaine du front
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  // on autorise le partage du cookie
  res.header('Access-Control-Allow-Credentials', true);
  // on autorise le partage de ressources entre origines
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Set-Cookie');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');
  next();
});
// On utilise le router
app.use('/api', router);

// On ecoute le port 
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

// On exports app pour l'index
module.exports = app;
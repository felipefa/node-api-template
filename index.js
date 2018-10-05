const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const objeto = require('./routes/objeto.route'); // Importa os routes para o alinhamento
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

// URL da conexão com o BD
const dev_db_url = "mongodb://user:password@address.mlab.com:port/bdName";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Configuração da engine da view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Inicia routes
const versaoApi = "/v1/";
app.use(versaoApi+'objetos', objeto);

// Direciona para página inicial
app.get('/', (req, res) => res.render('pages/index'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
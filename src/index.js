 // npm init
 // npm install --save-exact express@4.17.1 cors@2.8.5 mysql@2.17.1 multer@1.4.2 file-extension
 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const events = require('./actualites');
const upload = require('./upload');
const config = require('../config.json');

const { host, user, password, database } = config.database;

const connection = mysql.createConnection({
  host, 
  user,
  password,
  database
});

connection.connect();

const port = 3000;

// Mes origines acceptées
const allowOrigins = ['https://localhost:4200', 'http://autre.exemple.com'];

const app = express();

app.use('request', (request, response) => {

    // On test si l'entête "Origin" fait partie des origines acceptées
    if (request.headers['origin'] && allowOrigins.includes(request.headers['origin'])) {

        // Si oui alors on renseigne "Access-Control-Allow-Origin" avec l'origine de la requête
        response.setHeader('Access-Control-Allow-Origin', request.headers['origin']);
    } else {

        // Sinon on renseigne "Access-Control-Allow-Origin" à null créant une erreur CORS dans le navigateur
        response.setHeader('Access-Control-Allow-Origin', 'null');
    }

    if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization');
        response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

        return response.end();
    }

    // suite du traitement ...
});

app
  //.use(cors())
  .use(bodyParser.json())
  .use(events(connection))
  .use(upload());


app.listen(port, () => {
  console.log(`api server listening on port ${port}`);
});
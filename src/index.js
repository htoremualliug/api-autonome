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


const app = express();



app
  //.use(cors())
  .use(bodyParser.json())
  .use(events(connection))
  .use(upload());


app.listen(port, () => {
  console.log(`api server listening on port ${port}`);
});
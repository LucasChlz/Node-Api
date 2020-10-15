const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config.json');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./controllers/ProductController')(app);

app.listen(PORT);
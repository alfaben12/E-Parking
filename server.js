const express = require('express')
const app = express()
const con = require('./config/db.js');
const dotenv = require('dotenv');
const AccountRouter = require('./routes/AccountRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', AccountRouter);


app.listen(process.env.RUN_PORT, () => console.log(`Example app listening on port ` + process.env.RUN_PORT));
const express = require('express')
const app = express()
const con = require('./config/db.js');
const dotenv = require('dotenv');
const AccountRouter = require('./routes/AccountRouter');
const LoginRouter = require('./routes/LoginRouter');
const RegisterRouter = require('./routes/RegisterRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/Account', AccountRouter);
app.use('/Login', LoginRouter);
app.use('/Register', RegisterRouter);


app.listen(process.env.RUN_PORT, () => console.log(`Example app listening on port ` + process.env.RUN_PORT));
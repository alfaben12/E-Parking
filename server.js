const express = require('express')
const app = express()
const con = require('./config/db.js');
const dotenv = require('dotenv');
const AccountRouter = require('./routes/AccountRouter');
const LoginRouter = require('./routes/LoginRouter');
const RegisterRouter = require('./routes/RegisterRouter');
const PaymentRouter = require('./routes/PaymentRouter');
const RoleRouter = require('./routes/RoleRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello KMIPN 2019!'))
app.use('/accounts', AccountRouter);
app.use('/logins', LoginRouter);
app.use('/registers', RegisterRouter);
app.use('/payments', PaymentRouter);
app.use('/roles', RoleRouter);


app.listen(process.env.RUN_PORT, () => console.log(`Example app listening on port ` + process.env.RUN_PORT));
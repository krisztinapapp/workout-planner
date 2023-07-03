require('./config/config');
require('./models/db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routesIdx = require('./routes/index.router');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', routesIdx);

app.use((err,req,res,next) => {
    res.status(500).send(err);
    next();
})

app.listen(process.env.PORT, () => 
    console.log(`Server started at port: ${process.env.PORT}`)
);
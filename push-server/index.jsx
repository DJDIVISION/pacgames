const express = require("express");
const morgan = require('morgan');
const path = require("path");
const cors = require('cors')

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true
  }));

// Routes
app.use(require('./routes/index.jsx'));

// Static Content
app.use(express.static(path.join(__dirname, 'public')))

app.listen(5000);
console.log('Server Listening on port 5000...')
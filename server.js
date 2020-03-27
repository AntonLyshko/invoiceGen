const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const connectDB = require('./config/db');
const server = require('http').Server(app);
const addUser = require('./create-user');
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Define Routes
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-X-Requested-With', '*');
	res.setHeader('Access-Control-Allow-Content-Type', '*');
	res.setHeader('Access-Control-Allow-Accept', 'true');
	next();
});

//app.use(express.static(__dirname + '/html'));

connectDB();
//addUser("admin", "123456");

app.use('/api/invoice', require('./routes/invoice'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/html', require('./routes/html'));

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

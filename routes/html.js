const express = require('express');
const fs = require('fs');
const router = express.Router();

// Get html version of invoice pdf
router.get('/', function(req, res) {
	try {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var readStream = fs.createReadStream(
			__dirname + '/html/index.html',
			'utf8'
		);
		readStream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});

router.get('/0', function(req, res) {
	try {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var readStream = fs.createReadStream(
			__dirname + '/html/index0.html',
			'utf8'
		);
		readStream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});

router.get('/1', function(req, res) {
	try {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var readStream = fs.createReadStream(
			__dirname + '/html/index1.html',
			'utf8'
		);
		readStream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});

router.get('/2', function(req, res) {
	try {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var readStream = fs.createReadStream(
			__dirname + '/html/index2.html',
			'utf8'
		);
		readStream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});

router.get('/3', function(req, res) {
	try {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var readStream = fs.createReadStream(
			__dirname + '/html/index3.html',
			'utf8'
		);
		readStream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});

router.get('/4', function(req, res) {
	try {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		var readStream = fs.createReadStream(
			__dirname + '/html/index4.html',
			'utf8'
		);
		readStream.pipe(res);
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;

const express = require('express');
const Invoice = require('../models/Invoice');
const Item = require('../models/Item');
const puppeteer = require('puppeteer');
const fs = require('fs');
const router = express.Router();
const merge = require('easy-pdf-merge');
const moment = require('moment');


async function mergeMultiplePDF(pdfFiles) {
	console.log('mergeMultiPdf');
	await merge(pdfFiles, __dirname + '/pdf/final.pdf', function(err) {
		if (err) {
			return console.log(err);
		}
		console.log('Success');
	});
}

async function printPDF() {
	console.log('pdf');
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page
		.goto('http://localhost:5000/api/html', {
			waitUntil: 'load'
		})
		.catch(err => console.error(err));
	const pdf = await page.pdf({ format: 'A4' });
	await browser.close();
	return pdf;
}

async function printPDFMulti(pageNum) {
	console.log('pdfMulti');
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	var pdfFiles = [];
	for (let i = 0; i < pageNum; i++) {
		await page
			.goto(`http://localhost:5000/api/html/${i}`, {
				waitUntil: 'load'
			})
			.catch(err => console.error(err));
		let fileName = __dirname + `/pdf/sample${i}.pdf`;
		pdfFiles.push(fileName);
		await page.pdf({ path: fileName, format: 'A4' });
	}
	await browser.close();
	await mergeMultiplePDF(pdfFiles);
}

async function getTotal(items) {
	console.log('getTotal');
	let total = 0;
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		total += item.amount;
	}
	return total;
}

async function getItems(items) {
	console.log('getItems');
	console.log(items);
	let pages = [];
	try {
		if (items.length > 3) {
			let html = '';
			for (let i = 0; i < 3; i++) {
				let item = items[i];
				html += `
				<div style='margin-top: 25px; float: left; width: 100%;'>
					<div style=' float: left; width: 50%;'>${item.name}</div>
					<div style='float: left; width: 25%;'>${item.quantity}</div>
					<div style='float: left; width: 25%; text-align: right'>${item.amount}</div>
				</div>
			`;
			}
			pages.push(html);
			html = '';
			let length = items.length;
			console.log('LENGTH - ' + length);
			for (let i = 3; i < items.length; i++) {
				let item = items[i];
				console.log(i);
				html += `
				<div style='margin-top: 25px; float: left; width: 100%;'>
					<div style=' float: left; width: 50%;'>${item.name}</div>
					<div style='float: left; width: 25%;'>${item.quantity}</div>
					<div style='float: left; width: 25%; text-align: right'>${item.amount}</div>
				</div>
			`;
				if (i % 12 == 0) {
					pages.push(html);
					html = '';
				}
				let check = length - i;
				if (check == 1) {
					pages.push(html);
					html = '';
				}
			}
		} else {
			let html = '';
	
				for (let i = 0; i < items.length; i++) {
					let item = items[i];
					html += `
				<div style='margin-top: 25px; float: left; width: 100%;'>
					<div style=' float: left; width: 50%;'>${item.name}</div>
					<div style='float: left; width: 25%;'>${item.quantity}</div>
					<div style='float: left; width: 25%; text-align: right'>${item.amount}</div>
				</div>
				`;
				}
			
			pages.push(html);
		}		
	} catch (err) {
		console.error(err)
	}

	return pages;
}

async function generateHtml(html) {
	console.log('generateHtml');
	var writeStream = fs.createWriteStream(__dirname + '/html/index.html', {
		encoding: 'utf8'
	});
	writeStream.write(html);
	writeStream.end();
}

async function generateHtmlMulti(pages) {
	for (let i = 0; i < pages.length; i++) {
		const page = pages[i];
		var writeStream = fs.createWriteStream(__dirname + `/html/index${i}.html`, {
			encoding: 'utf8'
		});
		writeStream.write(page);
		writeStream.end();
	}
}

// Get all invoices
router.get('/', async function(req, res) {
	let data = await Invoice.find();
	res.send(data);
});

// Get invoice by id
router.get('/:id', async function(req, res) {
	console.log('Get by id')
	let data = await Invoice.findOne({ invoice_id: req.params.id });
	res.send(data);
});

//Download pdf Invoice by id
router.get('/pdf/:id', async function(req, res) {
	console.log('Download')
	let invoiceData = await Invoice.findOne(
		{ invoice_id: req.params.id },
		(err, data) => {
			return data;
		}
	);
	let itemsData = await Item.find(
		{ invoice_id: req.params.id },
		(err, data) => {
			return data;
		}
	);

	let items = await getItems(itemsData);
	let total = await getTotal(itemsData);
	if (items.length > 1) {
		let pages = [];
		let html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
					rel="stylesheet"
				/>
				<title>Invoice promoforma ${invoiceData.invoice_id}</title>
			</head>
			<body
				style="color:#111111; font-family: 'Roboto', sans-serif; padding: 50px; font-size: 17px"
			>
				<div style="margin-bottom: 0px; float: right;">
					<img
						src="https://www.devotiondresses.com/images/logoRedesign.f5d6bb.svg"
						alt=""
						style="float: right; margin-bottom: 30px;"
					/>
					<br />
					<br />
					<div
						style="margin-bottom: 10px; width: 100%; float: right; text-align: right"
					>
					${invoiceData.invoice_id}
					</div>
					<div
						style="margin-bottom: 10px; width: 100%; float: right; text-align: right;"
					>
					${moment(invoiceData.created_at).format('MMMM DD YYYY')}
					</div>
				</div>
				<div style="float: left; margin-top: 50px">
					<div>
						<div style="width: 60%; float: left;">
							<div style="width: 100%; font-size: 22px; font-weight: 700;">
								Delivery address
							</div>
							<div style="width: 90%; margin-top: 15px">
							${invoiceData.delivery_address}
							</div>
						</div>
						<div style="width: 40%; float: left;">
							<div style="width: 100%; font-size: 22px; font-weight: 700;">
								Customer address
							</div>
							<div style="width: 100%; margin-top: 15px">
							${invoiceData.customer_address}
							</div>
						</div>
					</div>
					<div style="margin-top: 50px; width: 60%; float: left;">
						<div style="margin-bottom: 5px;">
							<span
								style="font-weight: 700; text-transform: uppercase; margin-right: 5px"
								>Proforma Invoice</span
							>
							<span>${invoiceData.invoice_id}</span>
						</div>
						<div style="margin-bottom: 5px;">
							<span style="font-weight: 700; margin-right: 5px">Order number</span>
							<span>${invoiceData.order_id}</span>
						</div>
						<div>
							<span style="font-weight: 700; margin-right: 5px">Payment reference:</span style="margin-bottom: 5px;">
							<span>${invoiceData.payment_reference}</span>
						</div>
					</div>
		
					<div style="margin-top: 50px; width:40%; float: left">
						<div style="font-weight: 700; margin-bottom: 5px;">
							Payment Method:
						</div>
						wire transfer
					</div>
			</div>
			<div style='float: left; width: 100%;'>
				<div style='width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px'></div>
			</div>
			<div style='float: left; margin-top: 40px'>
				<div><span style="font-weight: 700; margin-right: 5px">Account: </span>2200960734</div>
				<div><span style="font-weight: 700; margin-right: 5px">Account owner: </span>Devotion s.r.o</div>
				<div><span style="font-weight: 700; margin-right: 5px">IBAN: </span>CZ9220100000002200960734</div>
				<div><span style="font-weight: 700; margin-right: 5px">BIC/swift: </span>FIOBCZPPXXX</div>
				<div><span style="font-weight: 700; margin-right: 5px">Bank address: </span>Fio banka, a.s., V Celnici 1028/10, 117 21 Praha 1, Czech Republic</div>
			</div>
			<div style='float: left; width: 100%;'>
				<div style='width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px'></div>
			</div>
			
			<div style='float: left; margin-top: 40px; font-size: 15px; text-align: left; width:100%'>
				The supply of goods is expempt according to the $66 of the VAT Act valid in the Czech Republic
			</div>
		
				<div style="width: 100%; margin-top: 60px; float: left;">
					<div style='float: left; width: 50%;'>Items</div>
					<div style='float: left; width: 25%;'>Quantity</div>
					<div style='float: left; width: 25%; text-align: right'>Amout</div>
					<div style='width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px'></div>
					${items[0]}
				</div>
				<div style='position: absolute; bottom: 15px; text-align: center; font-size: 12px; width: 85%'>
				See next page<br />
					Devotion s.r.o <br />
					Registration ID: 03835448, VAT-ID: CZ03835448 <br />
					Registered at Municipal court at Prague under section C, number 238590 <br />
					Registred office: Na Male Sarce 801, Nebusice, 164 00 Praha , Czech Republic Page 1 of ${items.length}
				</div>
			</body>
		</html>
		`;
		pages.push(html);
		html = '';
		for (let i = 1; i < items.length; i++) {
			let item = items[i];
			let html = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<link
						href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
						rel="stylesheet"
					/>
					<title>Invoice promoforma ${invoiceData.invoice_id}</title>
				</head>
				<body
					style="color:#111111; font-family: 'Roboto', sans-serif; padding: 50px; font-size: 17px"
				>
					<div style="margin-bottom: 0px; float: right;">
						<img
							src="https://www.devotiondresses.com/images/logoRedesign.f5d6bb.svg"
							alt=""
							style="float: right; margin-bottom: 30px;"
						/>
						<br />
						<br />
						<div
							style="margin-bottom: 10px; width: 100%; float: right; text-align: right"
						>
						${invoiceData.invoice_id}
						</div>
						<div
							style="margin-bottom: 10px; width: 100%; float: right; text-align: right;"
						>
						${moment(invoiceData.created_at).format('MMMM DD YYYY')}
						</div>
					</div>
			
					<div style="width: 100%; margin-top: 60px; float: left;">
						<div style="float: left; width: 50%;">Items</div>
						<div style="float: left; width: 25%;">Quantity</div>
						<div style="float: left; width: 25%; text-align: right">Amout</div>
						<div
							style="width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px"
						></div>

						${item}

						<div
							style="font-weight: 700; font-size: 20px; float: right; margin-top: 40px"
						>
							<span style="margin-right: 10px;">Total: </span><span>$ ${total}</span>
						</div>
					</div>
					<div
						style="position: absolute; bottom: 15px; text-align: center; font-size: 12px; width: 85%"
					>
						Devotion s.r.o <br />
						Registration ID: 03835448, VAT-ID: CZ03835448 <br />
						Registered at Municipal court at Prague under section C, number 238590
						<br />
						Registred office: Na Male Sarce 801, Nebusice, 164 00 Praha , Czech
						Republic Page 1 of ${items.length}
					</div>
				</body>
			</html>			
			`;
			pages.push(html);
		}

		try {
			await generateHtmlMulti(pages);
			await printPDFMulti(pages.length);
			setTimeout(() => {
				console.log('Началось');
				let fileName = __dirname + '/pdf/final.pdf';
				var readStream = fs.createReadStream(fileName);
				readStream.on('open', function() {
					console.log('Отправляю');
					readStream.pipe(res);
				});
			}, 1500);
		} catch (err) {
			console.error(err);
		}
	} else {
		const html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					href="https://fonts.googleapis.com/css?family=Roboto&display=swap"
					rel="stylesheet"
				/>
				<title>Invoice promoforma ${invoiceData.invoice_id}</title>
			</head>
			<body
				style="color:#111111; font-family: 'Roboto', sans-serif; padding: 50px; font-size: 17px"
			>
				<div style="margin-bottom: 0px; float: right;">
					<img
						src="https://www.devotiondresses.com/images/logoRedesign.f5d6bb.svg"
						alt=""
						style="float: right; margin-bottom: 30px;"
					/>
					<br />
					<br />
					<div
						style="margin-bottom: 10px; width: 100%; float: right; text-align: right"
					>
					${invoiceData.invoice_id}
					</div>
					<div
						style="margin-bottom: 10px; width: 100%; float: right; text-align: right;"
					>
					${moment(invoiceData.created_at).format('MMMM DD YYYY')}
					</div>
				</div>
				<div style="float: left; margin-top: 50px">
					<div>
						<div style="width: 60%; float: left;">
							<div style="width: 100%; font-size: 22px; font-weight: 700;">
								Delivery address
							</div>
							<div style="width: 90%; margin-top: 15px">
							${invoiceData.delivery_address}
							</div>
						</div>
						<div style="width: 40%; float: left;">
							<div style="width: 100%; font-size: 22px; font-weight: 700;">
								Customer address
							</div>
							<div style="width: 100%; margin-top: 15px">
							${invoiceData.customer_address}
							</div>
						</div>
					</div>
					<div style="margin-top: 50px; width: 60%; float: left;">
						<div style="margin-bottom: 5px;">
							<span
								style="font-weight: 700; text-transform: uppercase; margin-right: 5px"
								>Proforma Invoice</span
							>
							<span>${invoiceData.invoice_id}</span>
						</div>
						<div style="margin-bottom: 5px;">
							<span style="font-weight: 700; margin-right: 5px">Order number</span>
							<span>${invoiceData.order_id}</span>
						</div>
						<div>
							<span style="font-weight: 700; margin-right: 5px">Payment reference:</span style="margin-bottom: 5px;">
							<span>${invoiceData.payment_reference}</span>
						</div>
					</div>
		
					<div style="margin-top: 50px; width:40%; float: left">
						<div style="font-weight: 700; margin-bottom: 5px;">
							Payment Method:
						</div>
						wire transfer
					</div>
			</div>
			<div style='float: left; width: 100%;'>
				<div style='width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px'></div>
			</div>
			<div style='float: left; margin-top: 40px'>
				<div><span style="font-weight: 700; margin-right: 5px">Account: </span>2200960734</div>
				<div><span style="font-weight: 700; margin-right: 5px">Account owner: </span>Devotion s.r.o</div>
				<div><span style="font-weight: 700; margin-right: 5px">IBAN: </span>CZ9220100000002200960734</div>
				<div><span style="font-weight: 700; margin-right: 5px">BIC/swift: </span>FIOBCZPPXXX</div>
				<div><span style="font-weight: 700; margin-right: 5px">Bank address: </span>Fio banka, a.s., V Celnici 1028/10, 117 21 Praha 1, Czech Republic</div>
			</div>
			<div style='float: left; width: 100%;'>
				<div style='width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px'></div>
			</div>
			
			<div style='float: left; margin-top: 40px; font-size: 15px; text-align: left; width:100%'>
				The supply of goods is expempt according to the $66 of the VAT Act valid in the Czech Republic
			</div>
		
				<div style="width: 100%; margin-top: 60px; float: left;">
					<div style='float: left; width: 50%;'>Items</div>
					<div style='float: left; width: 25%;'>Quantity</div>
					<div style='float: left; width: 25%; text-align: right'>Amout</div>
					<div style='width 90%; margin: 10px auto; height: 3px; background: #e4e4e4; position: relative; top: 25px'></div>
					${items[0]}
					<div style='font-weight: 700; font-size: 20px; float: right; margin-top: 40px'><span style='margin-right: 10px;'>Total: </span><span>$ ${total}</span></div>
				</div>
				<div style='position: absolute; bottom: 15px; text-align: center; font-size: 12px; width: 85%'>
					Devotion s.r.o <br />
					Registration ID: 03835448, VAT-ID: CZ03835448 <br />
					Registered at Municipal court at Prague under section C, number 238590 <br />
					Registred office: Na Male Sarce 801, Nebusice, 164 00 Praha , Czech Republic Page 1 of 1
				</div>
			</body>
		</html>
		`;

		try {
			await generateHtml(html);
			await printPDF().then(pdf => {
				res.set({
					'Content-Type': 'application/pdf',
					'Content-Length': pdf.length
				});
				res.send(pdf);
			});
		} catch (err) {
			console.error(err);
		}
	}
});

// Insert data into database
router.post('/', async function(req, res) {
	console.log('Inserting data');
	console.log(req.body);
	let items = req.body.items;
	try {
		let invoice = await Invoice.findOne({ invoice_id: req.body.invoice_id });
		if (invoice) {
			res.send('This invoice has already exist');
			return;
		}
		for (let i = 0; i < items.length; i++) {
			let item = new Item(items[i]);
			await item.save();
		}
		invoice = new Invoice(req.body);
		await invoice.save();
	} catch (err) {
		console.error(err)
	}
	res.send('OK');
});

// Edit invoice
router.put('/:id', async function(req, res) {
	await Invoice.findOneAndUpdate({ invoice_id: req.params.id }, req.body);
	res.send('OK');
});

// Delete Invoice
router.delete('/:id', async function(req, res) {
	await Invoice.deleteOne({ invoice_id: req.params.id });
	await Item.deleteMany({ invoice_id: req.params.id });
	res.send('OK');
});

module.exports = router;

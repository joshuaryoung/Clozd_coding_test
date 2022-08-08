const express = require('express');
const app = express();
const port = 8080;
const db = require('./db');

app.use(express.json());
app.use(express.urlencoded());

/**
 * GET /companies
 * Fetches all companies in the database
 */
app.get('/companies', (req, res) => {
	const sql = `
		SELECT * FROM companies;
	`;
	const params = [];

	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		
		res.json({
			message: 'success',
			data: rows
		});
	});
});
app.get('/companies/:companyId', (req, res) => {
	const { companyId } = req.params || {}
	// console.log({companyId})
	const sql = `
		select c.*, group_concat(d.name) as departments from companies c
			join departments d on c.id = d.company_id
		where c.id = $id
		group by c.id;
	`;
	const params = { $id: companyId };

	db.all(sql, params, (err, rows) => {
		if (err) {
			console.error(err)
			res.status(400).json({
				error: err.message
			});
			return;
		}
		
		res.json({
			message: 'success',
			data: rows[0]
		});
	});
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});
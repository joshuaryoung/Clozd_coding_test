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
	const companySql = `
		select c.*, null as departments from companies c
		where c.id = $id;
	`;
	const companyParams = { $id: companyId };

	const departmentsSql = `
		select d.id,
			d.name,
			json_group_array(json_object(
			'id', e.id,
			'name', e.name,
			'title', e.title,
			'country', e.country,
			'avatar', e.avatar
			)) as employees
		from departments d
			join employees e on d.id = e.department_id
		where d.id in (select d.id from departments d
		where company_id = $id)
		group by d.id;
	`;

	db.all(companySql, companyParams, (err, rows) => {
		if (err) {
			console.error(err)
			res.status(400).json({
				error: err.message
			});
			return;
		}
		
		const companyData = rows[0] || {}

		db.all(departmentsSql, companyParams, (err, dRows) => {
			if (err) {
				console.error(err)
				res.status(400).json({
					error: err.message
				});
				return;
			}
			companyData.departments = dRows.map(el => {
				return { ...el, employees: JSON.parse(el.employees)}
			})
			res.json({
				message: 'success',
				data: companyData
			});
		})
	});
	
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});
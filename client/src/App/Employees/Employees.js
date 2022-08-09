import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Employees.css'

const TableRow = ({
	className,
	name,
    avatar,
    title,
    country
}) => (
	<div className={className}>
		{ avatar ==='Pic' ? <div className="companies_row-cell">{avatar}</div> : <div className="companies_row-cell"><img className='emp-pic' src={avatar} /></div>}
		<div className="companies_row-cell">{name}</div>
		<div className="companies_row-cell">{title}</div>
		<div className="companies_row-cell">{country}</div>
	</div>
);

const Employees = ({ companyData }) => {
    const { departmentId } = useParams()
    const [selectedDepartment, setSelectedDepartment] = useState()

    useEffect(() => {
        const _selectedDep = companyData &&
        companyData.departments &&
        companyData.departments.find(el => el.id == departmentId)

        setSelectedDepartment(_selectedDep)
    }, [companyData, departmentId])
	return (
        <div>
            <h2 id="department-name">{selectedDepartment && selectedDepartment.name}</h2>
            <div id="employee-data-table">
                <TableRow
                    className="companies_header"
                    name="Employee Name"
                    avatar="Pic"
                    title="Employee Title"
                    country="Country"
                />
                {selectedDepartment &&
                    selectedDepartment.employees &&
                    selectedDepartment.employees.map(emp => {
                        return (
                            <TableRow
                                className="companies_row"
                                name={emp.name}
                                avatar={emp.avatar}
                                title={emp.title}
                                country={emp.country}
                                key={emp.id}
                            />
                        )
                    })
                }
            </div>
        </div>
	);
};

export default Employees;
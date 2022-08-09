import React, { forwardRef } from 'react';
import { useEffect } from 'react';
import { useParams, useLocation, Outlet, useNavigate } from 'react-router-dom';
import './Company.css'

const TableRow = ({
	className,
	onClick,
	name,
    employeeCount
}) => (
	<div className={className} onClick={onClick}>
		<div className="companies_row-cell">{name}</div>
		<div className="companies_row-cell">{employeeCount}</div>
	</div>
);

const Company = forwardRef(({ companyData, setCompanyData, setCrumbs }, crumbsRef) => {
    const { companyId } = useParams()
    const navigate = useNavigate()
    
    useEffect(async () => {
        setCompanyData(null)
        const resData = await fetchData(companyId)
        updateCrumbs(resData, companyId, crumbsRef.current)
        setCompanyData(resData)
    }, [])

    function updateCrumbs (data, companyId) {
        const indexToUpdate = crumbsRef.current.findIndex(el => {
            return el.name == companyId || el.name === data.name
        } )
        if (indexToUpdate < 0) {
            console.warn('indexToUpdate not found!')
            return
        }
    
        const { destination } = crumbsRef.current[indexToUpdate] || {}
        if (!destination) {
            console.warn('destination is undefined!')
            return
        }
    
        const newCrumbs = [...crumbsRef.current]
        newCrumbs[indexToUpdate] = { name: data.name, destination }
        crumbsRef.current = newCrumbs
        setCrumbs(newCrumbs)
    }

    const handleDepRowClick = (depId) => {
        if (!depId) {
            console.warn('Required parameter depId (Int) not receieved!')
            return
        }

        navigate({ pathname: `${depId}` })
    } 
        
    return (
        <div>
            <div>
                {companyData && 
                    (<div>
                        <div id="company-name-container">
                            <h1>
                                {companyData.name}
                            </h1>
                        </div>
                        <div id="metadata-container">
                            <div className="metadata-row">
                                <div className="metadata-key">Segment</div>
                                <div>{companyData.segment}</div>
                            </div>
                            <div className="metadata-row">
                                <div className="metadata-key">Region</div>
                                <div>{companyData.region}</div>
                            </div>
                            <div className="metadata-row">
                                <div className="metadata-key">Industry</div>
                                <div>{companyData.industry}</div>
                            </div>
                        </div>
                    </div>)
                }
            </div>
            <div>
                <TableRow
                    className="companies_header"
                    name="Department Name"
                    employeeCount="Employee Count"
                />
                {companyData && companyData.departments && companyData.departments.map(dep => {
                    return (<TableRow
                                className="companies_row"
                                name={dep.name}
                                employeeCount={dep.employees.length}
                                key={dep.id}
                                onClick={el => handleDepRowClick(dep.id)}
                            />)
                })}

                <Outlet />
            </div>
        </div>
	);
});

export const fetchData = async (companyId) => {
    if (!companyId) {
        console.warn('companyId not provided!')
        return
    }
        
    const res = await fetch(`/companies/${companyId}`)
    .catch(err => {
        console.error(err)
        return
    })
    const resJson = await res.json()
    return resJson.data
}

export default Company;
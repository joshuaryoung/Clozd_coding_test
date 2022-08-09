import React, { forwardRef, useState } from 'react';
import { useEffect } from 'react';
import { useParams, useLocation, Outlet, useNavigate } from 'react-router-dom';
import './Company.css'
import editIcon from '../Assets/edit.png'
import checkmarkIcon from '../Assets/checkmark.png'
import cancelIcon from '../Assets/cancel.png'

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
    const [isEditingName, setIsEditingName] = useState(false)
    const [companyModel, setCompanyModel] = useState()
    
    useEffect(async () => {
        setCompanyData(null)
        const resData = await fetchData(companyId)
        updateCrumbs(resData, companyId)
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

        setIsEditingName(false)

        navigate({ pathname: `${depId}` })
    }

    const handleEditNameClick = () => {
        setCompanyModel(companyData.name)
        setIsEditingName(true)
    }

    const handleInputChange = (e) => {
        const { value } = e && e.target || {}
        setCompanyModel(value)
    }

    const handleSaveNameClick = async () => {
        const res = await fetch(`/companies/${companyId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyId, companyModel }) })
        .catch(err => {
            console.error(err)
            setIsEditingName(false)
            alert('There was a problem updating that company name! Please try again or contact support')
            return
        })

        try {
            const newData = await fetchData(companyId)
            updateCrumbs(newData, companyId)
            setCompanyData(newData)
            setIsEditingName(false)
        } catch (error) {
            console.error(error)
            setIsEditingName(false)
            alert('There was a problem updating that company name! Please try again or contact support')
            return
        }
    }

    const handleEditNameCancel = () => {
        setIsEditingName(false)
    }
        
    return (
        <div>
            <div>
                {companyData && 
                    (<div>
                        <div id="company-name-container">
                            {!isEditingName ? <h1>{companyData.name}</h1> : <input type="text" value={companyModel} onChange={handleInputChange} />}
                            {!isEditingName ? <img id="edit-icon" src={editIcon} onClick={handleEditNameClick} /> : <div><img id="edit-icon" src={checkmarkIcon} onClick={handleSaveNameClick} /><img id="edit-icon" src={cancelIcon} onClick={handleEditNameCancel} /></div>}
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
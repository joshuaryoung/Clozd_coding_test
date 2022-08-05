import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Company = ({ crumbs = [], setCrumbs }) => {
	const location = useLocation()
    const { companyId } = useParams() || {}
    const [companyData, setCompanyData] = useState()

    const updateCrumbs = (data) => {
        console.log({crumbs})
        const indexToUpdate = crumbs.findIndex(el => {
            // debugger
            return el.name == companyId || el.name === data.name
        } )
        if (indexToUpdate < 0) {
            console.warn('indexToUpdate not found!')
            return
        }

        const { destination } = crumbs[indexToUpdate] || {}
        if (!destination) {
            console.warn('destination is undefined!')
            return
        }
        // const companyToUse =  data.find(el => el.id == companyId)
        const newCrumbs = [...crumbs]
        // debugger
        // newCrumbs.splice(indexToUpdate, 1)
        newCrumbs[indexToUpdate] = { name: data.name, destination }
        setCrumbs(newCrumbs)
        console.log({ indexToUpdate })
    }


    useEffect(() => {
        fetch(`/companies/${companyId}`)
            .then((response) => response.json())
            .then(({data}) => {
                console.log({data})
                setCompanyData(data)
                updateCrumbs(data)
            })
    }, [companyId, location])

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
                        <div id="company-name-container">
                            <h1>
                                {companyData.name}
                            </h1>
                        </div>
                        {companyData.id}
                        {companyData.industry}
                        {companyData.region}
                        {companyData.segment}
                    </div>)
                }
            </div>
        </div>
	);
};

export default Company;
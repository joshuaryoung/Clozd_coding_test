import React, { forwardRef } from 'react';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';


const Company = forwardRef(({ companyData, setCompanyData, setCrumbs }, crumbsRef) => {
    const { companyId } = useParams()
    
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
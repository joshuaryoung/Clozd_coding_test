import React, { useEffect, useState, useRef } from 'react';
import {
	Routes,
	Route,
	useLocation
} from 'react-router-dom';
import PageContainer from './PageContainer/PageContainer.js';
import Companies from './Companies/Companies.js';
import Company from './Views/Company'
import Employees from './Employees/Employees'
import { mapLocations } from './PageContainer/Breadcrumbs/Breadcrumbs.js';

const App = () => {
	const location = useLocation()
    const [crumbs, setCrumbs] = useState()
    const [companyData, setCompanyData] = useState()
    const crumbsRef = useRef(mapLocations(location))

	useEffect(async () => {
        const newCrumbs = mapLocations(location)
        crumbsRef.current = newCrumbs
        setCrumbs(newCrumbs)
	}, [location.pathname])
	return (
        <Routes>
            <Route path="/" element={<PageContainer crumbs={crumbs} />}>
                <Route index element={<Companies />} />
                <Route path="companies" element={<Companies />} />
                <Route path="companies/:companyId" element={<Company companyData={companyData} setCompanyData={setCompanyData} setCrumbs={setCrumbs} ref={crumbsRef} />}>
                    <Route path=":departmentId" element={<Employees companyData={companyData} />} />
                </Route>
            </Route>
        </Routes>
	);
};

export default App;

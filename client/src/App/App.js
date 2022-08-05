import React, { useEffect, useState } from 'react';
import {
	Routes,
	Route,
	useLocation,
} from 'react-router-dom';
import PageContainer from './PageContainer/PageContainer.js';
import Companies from './Companies/Companies.js';
import Company from './Views/Company'
import { mapLocations } from './PageContainer/Breadcrumbs/Breadcrumbs.js';

const App = () => {
	const location = useLocation()
	const [crumbs, setCrumbs] = useState([]) // TODO: What should breadcrumb handling be like?

	useEffect(() => setCrumbs(mapLocations(location)), [location])
	return (
			<Routes>
				<Route path="/" element={<PageContainer crumbs={crumbs} />}>
					<Route index element={<Companies />} />
					<Route path="companies" element={<Companies />} />
					<Route path="companies/:companyId" element={<Company crumbs={crumbs} setCrumbs={setCrumbs}/>} />
				</Route>
			</Routes>
	);
};

export default App;

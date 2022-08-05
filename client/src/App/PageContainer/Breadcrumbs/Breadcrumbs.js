import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = ({ crumbs }) => {

	// switch (location.pathname) {
	// 	case '/':
	// 	case '/companies':
	// 		crumbs.push({
	// 			name: 'Companies',
	// 			destination: '/companies',
	// 		});
	// 		break;
	// 	default:
	// 		break;
	// }

	return (
		<div className="breadcrumbs">
			<div className="breadcrumbs_crumb">/</div>
			{crumbs &&crumbs.map(crumb => (
				crumb &&
				<div className="breadcrumbs_crumb" key={crumb.name}>
					<Link to={crumb.destination}>{crumb.name}</Link>
					/
				</div>
			))}
		</div>
	);
};

export const mapLocations = (location) => {
	const splitPathname = location.pathname.split('/').filter(el => el)
	let cumulativeLocName = ''

	return location &&
	location.pathname.length &&
	location.pathname.split('/').filter(el => el).map((el, i) => {
		cumulativeLocName += el + '/'
		console.log({ cumulativeLocName });

		return {
			name: el[0].toUpperCase() + el.slice(1),
			destination: cumulativeLocName
	}}) || []
}

export default Breadcrumbs;
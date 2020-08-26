import React, { useState, useEffect } from 'react';
import {
	Navbar,
	Nav,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { logout } from '../../redux/actions/authentication';
import {
	successLogOutNotification,
} from '../../redux/constants/notifications';
import { createNotification } from 'react-redux-notify';
import { Badge } from '@material-ui/core';


const Header = ({ username, userType, companyType, logout, createNotification }) => {

	const history = useHistory();
	const [potentialsCustomers, setPotentialsCustomers] = useState(0);

	async function handleLogout() {
		try {
			await axios.post('/api/auth/logout');
			logout();
			createNotification(successLogOutNotification);
			history.push('/');
		} catch (error) {
			console.log(error);
		}
	}

	const getPotentialsCustomersNotificationsCount = async () => {
		const request = await axios.get('/api/company/get-potentials-customers-notifications-count');
		setPotentialsCustomers(request.data);
	};

	useEffect(() => {
		if (companyType === 0) {
			getPotentialsCustomersNotificationsCount();
			const interval = setInterval(() => {
				getPotentialsCustomersNotificationsCount();
			}, 5000);
			return () => clearInterval(interval);
		}
	}, [companyType]);

	return (
		<header>
			<Navbar bg="dark" variant="dark" expand="sm">
				<Link className="navbar-brand" to="/">AME</Link>
				<Navbar.Toggle aria-controls="navbar-collapse" />
				<Navbar.Collapse id="navbar-collapse">
					<Nav className="w-100">
						<Nav className="mr-auto">
							<Nav.Item>
								<Link className="nav-link" to="/">Inicio</Link>
							</Nav.Item>
							{userType === 1
								?
								<>
									<Nav.Item>
										<Link className="nav-link" to="/invoices">
											Mis facturas
										</Link>
									</Nav.Item>
									<Nav.Item>
										<Link className="nav-link" to="/consumptions">
											Mis consumos
										</Link>
									</Nav.Item>
								</>
								:
								<>
									{companyType === 0
										?
										<>
											<Nav.Item>
												<Link className="nav-link" to="/offers">
													Ofertas
												</Link>
											</Nav.Item>
											<Nav.Item>
												<Link className="nav-link" to="/my-customers">
													<Badge badgeContent={potentialsCustomers} color="primary">
														Mis clientes
													</Badge>
												</Link>
											</Nav.Item>
										</>
										:
										<></>
									}
								</>
							}
						</Nav>
						<Nav>
							{username
								?
								<>
									<Nav.Item>
										<Link className="nav-link" to="/profile">
											{username}
										</Link>
									</Nav.Item>
									<Nav.Item>
										<Link className="nav-link" to="/" onClick={handleLogout}>
											Cerrar sesión
										</Link>
									</Nav.Item>
								</>
								:
								<>
									<Nav.Item>
										<Link className="nav-link" to="/signup-customer">
											Regístrate
										</Link>
									</Nav.Item>
									<Nav.Item>
										<Link className="nav-link" to="/login">
											Inicia sesión
										</Link>
									</Nav.Item>
								</>
							}
						</Nav>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</header>
	);
}

const mapDispatchToProps = dispatch => ({
	createNotification: (config) => {
		dispatch(createNotification(config))
	},
	logout: () => dispatch(logout())
})

export default connect(
	null,
	mapDispatchToProps
)(Header);
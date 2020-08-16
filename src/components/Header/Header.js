import React from 'react';
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


const Header = ({ loggedUser, logout, createNotification }) => {

	const history = useHistory();

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
							{loggedUser
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
								<></>
							}
						</Nav>
						<Nav>
							{loggedUser
								?
								<>
									<Nav.Item>
										<Link className="nav-link" to="">
											{loggedUser}
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
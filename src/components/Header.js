import React from 'react';
import {
	Navbar,
	Nav,
} from 'react-bootstrap';

const Header = () =>
	<header>
		<Navbar bg="dark" variant="dark" expand="sm">
			<Navbar.Brand href="#">AME</Navbar.Brand>
			<Navbar.Toggle aria-controls="navbar-collapse"/>
			<Navbar.Collapse id="navbar-collapse">
				<Nav className="w-100">
					<Nav className="mr-auto">
						<Nav.Item>
							<Nav.Link href="#">Inicio</Nav.Link>
						</Nav.Item>
					</Nav>
					<Nav>
						<Nav.Item>
							<Nav.Link>
								Regístrate
						</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link>
								Inicia sesión
						</Nav.Link>
						</Nav.Item>
					</Nav>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	</header>

export default Header;
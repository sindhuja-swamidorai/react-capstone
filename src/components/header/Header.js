import '../../css/styles.css';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LinkContainer} from 'react-router-bootstrap';

export default function CustomHeader() {
    return (
    <header>
    <h1> KeepNotes</h1>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
      <Navbar.Brand href="#home">KeepNotes</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav>
            <Nav.Item>
                <LinkContainer to="/">
                <Nav.Link eventKey="Link-0">Home</Nav.Link>
                </LinkContainer>
            </Nav.Item>
            <Nav.Item>
            <LinkContainer to="/UserTodo/-1">
                <Nav.Link eventKey="link-1">List User Todo</Nav.Link>
            </LinkContainer>
            </Nav.Item>
            <Nav.Item>
            <LinkContainer to="/NewTodo">
                <Nav.Link eventKey="link-2">Add New Todo</Nav.Link>
            </LinkContainer>
            </Nav.Item>
            <Nav.Item>
            <LinkContainer to="/NewUser">
                <Nav.Link eventKey="link-3">Add New User</Nav.Link>
            </LinkContainer>
            </Nav.Item>
    </Nav>
    </Navbar.Collapse>
    </Container>
    </Navbar>
    </header>
    )
}

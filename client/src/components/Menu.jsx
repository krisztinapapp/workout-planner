import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { getUserInfo } from '../api';

const Menu = () => {
    const [username, setUsername] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(localStorage.getItem('token') != null && localStorage.getItem('token') !== 'undefined')
    }, []);
  
    useEffect(() => {
        if(loggedIn) {
            const asyncGetUserInfo = async () => {
            const user = await getUserInfo();
            setUsername(user.username);
            }
            asyncGetUserInfo();
        }
      }, [loggedIn]);

    return (
        <Navbar bg="light" expand="lg" sticky="top">
        <Container>
            { loggedIn ? (
                <Navbar.Brand href="/user">{ username }</Navbar.Brand>
            ) : (
                <Navbar.Brand href="/login">Reborn</Navbar.Brand>
            )}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/challenges">Kihívások</Nav.Link>
                    <NavDropdown title="Edzéstervek" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/my-plans">Saját</NavDropdown.Item>
                    <NavDropdown.Item href="/browse-plans">Böngészés</NavDropdown.Item>
                    <NavDropdown.Item href="/create-plan">Új létrehozása</NavDropdown.Item>
                </NavDropdown>
                { localStorage.getItem('token') == null || localStorage.getItem('token') === 'undefined' ? (
                    <Nav.Link href="/login">Bejelentkezés</Nav.Link>
                ) : (
                    <Nav.Link href="/login" onClick={ () => { 
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        localStorage.removeItem('isCoach');
                    }}>Kijelentkezés</Nav.Link>
                )}
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default Menu;
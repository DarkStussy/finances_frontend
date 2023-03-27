import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {getUser} from "../functions/user";
import {useEffect, useRef, useState} from "react";
import BaseNavDropdown from "./nav_dropdown";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Header = (props) => {
    let [user, setUser] = useState({username: ""});
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState({userInfo: false, fiat: false});
    useEffect(() => {
        const getUsername = async () => {
            const user = await getUser(props.accessToken);
            setUser({username: user['username']});
        };
        getUsername().catch(console.error);
    }, [props.accessToken]);

    const logout = () => {
        props.setAccessToken(null);
        setShowDropdown({...showDropdown, userInfo: false});
    };

    const getUserInfo = () => {
        if (user.username) {
            return (
                <BaseNavDropdown title={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                                 ref={dropdownRef} drop="start" show={showDropdown.userInfo}
                                 setShow={(v) => setShowDropdown({...showDropdown, userInfo: v})}>
                    <NavDropdown.Header>Username: {user.username}</NavDropdown.Header>
                    <LinkContainer to="/changePassword">
                        <NavDropdown.Item>Change password</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </BaseNavDropdown>
            );
        } else {
            return (
                <LinkContainer to={"/login"}>
                    <Nav.Link>Sign in</Nav.Link>
                </LinkContainer>
            )
        }
    }


    return (
        <header>
            <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand href="#home">CashFlowMate</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <BaseNavDropdown title="Fiat" ref={dropdownRef} drop="down-centered" show={showDropdown.fiat}
                                             setShow={(v) => setShowDropdown({
                                                 ...showDropdown,
                                                 fiat: v
                                             })}>
                                <NavDropdown.Item>Transactions</NavDropdown.Item>
                                <NavDropdown.Item>Assets</NavDropdown.Item>
                                <NavDropdown.Item>Stats</NavDropdown.Item>
                            </BaseNavDropdown>
                            <Nav.Link>Crypto</Nav.Link>
                        </Nav>
                        <Nav>
                            {getUserInfo()}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
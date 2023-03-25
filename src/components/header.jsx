import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {getUser} from "../functions/user";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";


const Header = (props) => {
    let [user, setUser] = useState({username: ""});
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        const getUsername = async () => {
            const user = await getUser(props.accessToken);
            console.log(user);
            setUser({username: user['username']});
        };
        getUsername().catch(console.error);
    }, [props.accessToken]);

    const logout = () => {
        props.setAccessToken(null);
        setShowDropdown(false);
    };

    const getUserInfo = () => {
        if (user.username) {
            return (
                <NavDropdown
                    className="user-options"
                    title={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                    menuVariant="dark" drop="start"
                    show={showDropdown}
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}>
                    <NavDropdown.Header>Username: {user.username}</NavDropdown.Header>
                    <NavDropdown.Item><Link className="text-white text-decoration-none"
                                            to="/">Settings</Link></NavDropdown.Item>
                    <NavDropdown.Item onClick={logout} href="">Logout</NavDropdown.Item>
                </NavDropdown>
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
                            <Nav.Link>Fiat</Nav.Link>
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
import {Button, Container, Form, Modal, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {getUser} from "../functions/user";
import {useEffect, useState} from "react";
import BaseNavDropdown from "./nav_dropdown";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getAllCurrencies, setBaseCurrency} from "../functions/currency";
import {errorInput} from "./forms/sign_up_form";
import {useNavigate} from "react-router-dom";


const Header = (props) => {
    let [user, setUser] = useState({username: ""});
    let [currencies, setCurrencies] = useState([]);
    const [showDropdown, setShowDropdown] = useState({userInfo: false, fiat: false});
    useEffect(() => {
        if(!props.accessToken)
            return;
        const getUsername = async () => {
            const user = await getUser(props.accessToken);
            setUser({username: user['username']});
        };

        const getAndSetCurrencies = async () => {
            const currencies = await getAllCurrencies(props.accessToken, "default");
            if (!currencies.detail)
                setCurrencies(currencies);
        }
        const fetchData = async () => {
            await Promise.allSettled(
                [getUsername(), getAndSetCurrencies()])
                .then((results) => results.forEach((result) => {
                    if (result.status === "rejected")
                        console.error(result.reason);
                }));

        }
        fetchData().catch(console.error);
    }, [props.accessToken]);
    const navigate = useNavigate();
    const logout = () => {
        props.setAccessToken(null);
        setUser({username: ""});
        setShowDropdown({...showDropdown, userInfo: false});
        navigate('/');
    };

    const getUserInfo = () => {
        if (user.username) {
            return (
                <BaseNavDropdown title={<FontAwesomeIcon icon={faEllipsisVertical}/>}
                                 drop="start" show={showDropdown.userInfo}
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

    const getNavlinks = () => {
        if (!props.accessToken)
            return <></>
        return <>
            <BaseNavDropdown title="Fiat" drop="down-centered" show={showDropdown.fiat}
                             setShow={(v) => setShowDropdown({
                                 ...showDropdown,
                                 fiat: v
                             })}>
                <NavDropdown.Header>Base currency: {props.baseCurrency.currentCode}</NavDropdown.Header>
                <NavDropdown.Item>Transactions</NavDropdown.Item>
                <LinkContainer to="/assets">
                    <NavDropdown.Item>Assets</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item>Stats</NavDropdown.Item>
                <NavDropdown.Item onClick={handleShow}>Change base currency</NavDropdown.Item>
            </BaseNavDropdown>
            <Nav.Link>Crypto</Nav.Link>
        </>

    }

    let [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const currenciesOptions = currencies.map((currency) => {
        const currencyID = currency["id"];
        const currencyCode = currency["code"];
        return <option value={currencyCode} key={currencyID}
                       data-key={currencyID}>{currency["name"]} | {currencyCode}</option>
    });
    let [error, setError] = useState("");
    const submitBaseCurrency = (e) => {
        e.preventDefault();

        const fetchBaseCurrency = async () => {
            const response = await setBaseCurrency(props.accessToken, props.baseCurrency.new["id"]);
            if (response.detail === "OK") {
                setShowModal(false);
                props.setBaseCurrencyState({currentCode: props.baseCurrency.new["code"], new: {}})
            } else {
                setError(response.detail);
            }
        }
        if (Object.keys(props.baseCurrency.new).length === 0) {
            setError("Currency not found");
        } else {
            fetchBaseCurrency().catch(console.error);
        }

    }
    const ValidateAndSetBaseCurrency = (e) => {
        const {value} = e.target;
        const currency = currencies.find(item => item.code === value);
        if (!currency) {
            props.setBaseCurrencyState({...props.baseCurrency, new: {}});
        } else {
            props.setBaseCurrencyState({...props.baseCurrency, new: currency});
            setError("");
        }
    }

    return (
        <>
            <header>
                <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                    <Container>
                        <LinkContainer to="/">
                            <Navbar.Brand>CashFlowMate</Navbar.Brand>
                        </LinkContainer>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                {getNavlinks()}
                            </Nav>
                            <Nav>
                                {getUserInfo()}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change base currency</Modal.Title>
                </Modal.Header>
                <Form onSubmit={submitBaseCurrency}>
                    <Modal.Body>
                        {errorInput(error)}
                        <Form.Control autoComplete="off" onChange={ValidateAndSetBaseCurrency} name="newBaseCurrency"
                                      type="text"
                                      list="currencies"
                                      placeholder="Type to search"/>
                        <datalist id="currencies">
                            {currenciesOptions}
                        </datalist>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" className="bg-gradient" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default Header;